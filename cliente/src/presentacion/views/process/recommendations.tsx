import { Button } from '@mui/material';
import React from 'react'
import { translateEmotion } from '../../../core/utils/emotion_translator';

interface RecommendationsProps {
  onReboot: () => void;
  imageSrc: string | undefined | null;
  emotion: string | undefined | null;
}

export const Recommendations = (props: RecommendationsProps) => {
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
        <div className="flex w-full flex-row justify-start items-center">
          <span className="text-xl font-bold text-indigo-500">
            RECURSOS RECOMENDADOS
          </span>
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
    </div>
  );
}
