import { Button } from '@mui/material';
import React, { ReactNode } from 'react'
import { translateEmotion } from '../../../core/utils/emotion_translator';

interface RecommendationsProps {
  onReboot: () => void;
  imageSrc: string | undefined | null;
  emotion: string | undefined | null;
}


export const gamesLink: any = {
  'neutral': [
    "https://cdn.htmlgames.com/Hangman/",
    "https://cdn.htmlgames.com/NumberMaze/",
    "https://cdn.htmlgames.com/HoneyBee/",
    "https://cdn.htmlgames.com/EasterPile/",
    "https://cdn.htmlgames.com/ToyFactory/",
  ],
  'angry': [
    "https://cdn.htmlgames.com/ForestBubbles/",
    "https://cdn.htmlgames.com/FrozenForChristmas/",
    "https://cdn.htmlgames.com/ZooMysteries/",
    "https://cdn.htmlgames.com/Bowling/",
  ],
  'happy': [
    "https://cdn.htmlgames.com/MonkeyInTrouble/",
    "https://cdn.htmlgames.com/ToyFactory/",
    "https://cdn.htmlgames.com/Minesweeper/",
    "https://cdn.htmlgames.com/BlockMonsters1010/",
    "https://cdn.htmlgames.com/PlushyAnimals/",
  ],
  'sad': [
    "https://cdn.htmlgames.com/GreedyWorm/",
    "https://cdn.htmlgames.com/ClassicSnake/",
    "https://cdn.htmlgames.com/WizardJewels/",
    "https://cdn.htmlgames.com/ClassicSnake/",
    "https://cdn.htmlgames.com/DarkMahjongConnect/",
  ]
}

export const Recommendations = (props: RecommendationsProps) => {

  console.log("emotion", props.emotion)
  const emotion = props.emotion!;
  const suggestion = gamesLink[emotion][
    Math.floor(Math.random() * gamesLink[emotion].length)
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <h2
        className="text-3xl my-2 font-bold"
      >
        Emoción detectada correctamente
      </h2>
      <img src={props.imageSrc ?? ''} />
      <h3
        className="text-xl my-2 font-bold"
      >
        <span className="text-blue-800">
          La emoción dominante es:
        </span>&nbsp;
        <span className="text-green-800">
          {translateEmotion(props.emotion)}
        </span>
      </h3>
      <div className="flex p-4 w-full flex-col justify-start items-center my-4">
        <div
          className="flex w-full flex-col justify-start items-start"
        >
          <span className="text-xl font-bold text-indigo-500">
            RECURSO RECOMENDADO
          </span>
          <iframe src={suggestion} width="100%" height="500px"></iframe>
        </div>
      </div>
      <div className="flex flex-row justify-center my-8">
        <Button
          variant="contained"
          onClick={props.onReboot}
        >
          Reboot
        </Button>
      </div>
    </div >
  );
}

