import { prisma } from "../lib/prisma";
import validate from "../middlewares/validateMiddleware";
import createPoolSchema from "../validations/createPoolValidation";
import express from "express";
import ShortUniqueId from "short-unique-id";
import authenticate from "../middlewares/authenticate";
import poolCodeSchema from "../validations/poolCodeValidation";
import gameSchema from "../validations/gameValidation";
import guessSchema from "../validations/guessValidation";
import getPoolSchema from "../validations/getPoolValidation";

export const router = express.Router();

router.post("/", authenticate, validate(createPoolSchema), async (req, res) => {
  const { title } = req.body;
  const generate = new ShortUniqueId({ length: 6 });
  const code = String(generate()).toUpperCase();

  try {
    await prisma.pools.create({
      data: {
        title,
        code,
        ownerId: req.userData.sub,

        participant: {
          create: {
            userId: req.userData.sub,
          },
        },
      },
    });
  } catch {
    await prisma.pools.create({
      data: {
        title,
        code,
      },
    });
  }

  return res.status(201).json({ code });
});

router.get("/", authenticate, async (req, res) => {
  const pools = await prisma.pools.findMany({
    where: {
      participant: {
        some: {
          userId: req.userData.sub,
        },
      },
    },
    include: {
      _count: {
        select: {
          participant: true,
        },
      },
      participant: {
        select: {
          id: true,

          user: {
            select: {
              avatarUrl: true,
            },
          },
        },
        take: 4,
      },
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return res.json({ pools });
});

router.get("/:id", authenticate, validate(getPoolSchema), async (req, res) => {
  const { id } = req.params;

  const pool = await prisma.pools.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          participant: true,
        },
      },
      participant: {
        select: {
          id: true,

          user: {
            select: {
              avatarUrl: true,
            },
          },
        },
        take: 4,
      },
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return res.json({ pool });
});

router.get("/count", async (req, res) => {
  const count = await prisma.pools.count();

  return res.json({
    count,
  });
});

router.post(
  "/join",
  authenticate,
  validate(poolCodeSchema),
  async (req, res) => {
    const { code } = req.body;

    const pool = await prisma.pools.findUnique({
      where: {
        code,
      },
      include: {
        participant: {
          where: {
            userId: req.userData.sub,
          },
        },
      },
    });

    if (!pool) {
      return res.send(400).json({ message: "Pool not found" });
    }

    if (pool.participant.length > 0) {
      return res.send(400).json({ message: "User already joined this pool." });
    }

    if (!pool.ownerId) {
      await prisma.pools.update({
        where: {
          id: pool.id,
        },
        data: {
          ownerId: req.userData.sub,
        },
      });
    }

    await prisma.participant.create({
      data: {
        poolsId: pool.id,
        userId: req.userData.sub,
      },
    });

    return res.status(201).json();
  }
);

router.get(
  "/:id/games",
  authenticate,
  validate(gameSchema),
  async (req, res) => {
    const { id } = req.params;

    const games = await prisma.game.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        guesses: {
          where: {
            participant: {
              userId: req.userData.sub,
              poolsId: id,
            },
          },
        },
      },
    });

    return res.json({
      games: games.map((game) => {
        return {
          ...game,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined,
        };
      }),
    });
  }
);

router.post(
  "/:poolId/games/:gameId/guesses",
  authenticate,
  validate(guessSchema),
  async (req, res) => {
    const { poolId, gameId } = req.params;
    const { firstTeamPoints, secondTeamPoints } = req.body;

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolsId: {
          poolsId: poolId,
          userId: req.userData.sub,
        },
      },
    });

    if (!participant) {
      return res.status(400).json({
        message: "User is not allowed to create a guess inside this pool.",
      });
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId: gameId,
        },
      },
    });

    if (guess) {
      return res.status(400).json({
        message: "User already sent a guess to this game on this pool.",
      });
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      return res.status(400).json({
        message: "Game not found.",
      });
    }

    if (game.date < new Date()) {
      return res.status(400).json({
        message: "User cannot send guesses after the game.",
      });
    }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firstTeamPoints,
        secondTeamPoints,
      },
    });

    return res.status(201).json({
      message: "Guess created!",
    });
  }
);
