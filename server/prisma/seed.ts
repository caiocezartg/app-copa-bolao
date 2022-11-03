import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Caio Cezar",
      email: "caiocezar@gmail.com",
      avatarUrl: "https://github.com/caiocezartg.png",
    },
  });

  const pool = await prisma.pools.create({
    data: {
      title: "Example Pool",
      code: "BOL123",
      ownerId: user.id,
      participant: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-03T12:20:33.039Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "DE",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-05T12:20:33.039Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolsId: {
                userId: user.id,
                poolsId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
