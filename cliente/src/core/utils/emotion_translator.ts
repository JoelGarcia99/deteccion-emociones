export const translateEmotion = (emotion: string | null | undefined) => {
  switch (emotion) {
    case 'neutral': return 'Neutral';
    case 'angry': return 'Enfado';
    case 'happy': return 'Felicidad';
    case 'sad': return 'Tristeza';
    case 'fear': return 'Miedo';
    case 'surprise': return 'Sorpresa';
    default: return 'Desconocida';
  }
}
