import bannerImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarImg from "../assets/users-avatar-example.png";
import Image from "next/image";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolName, setPoolName] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolName,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso! O código foi copiado para a área de transferência"
      );
      setPoolName("");
    } catch (error) {
      console.log(error);
      alert("Falha ao criar o bolão, tente novamente.");
    }
  }

  return (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Logo da NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da Copa e compartilhe entre seus amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarImg} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded text-sm bg-gray-800 border border-gray-600 text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={({ target }) => setPoolName(target.value)}
            value={poolName}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 text-sm font-bold uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar o meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar o seu bolão, você receberá um código único que poderá usar
          para convidar os seus amigos!
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={bannerImg}
        alt="Dois celulares exibindo a aplicação do NLW Copa"
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [{ data: dataPool }, { data: dataGuess }, { data: dataUser }] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: dataPool.count,
      guessCount: dataGuess.count,
      userCount: dataUser.count,
    },
  };
};
