export const translateEmotion = (emotion: string | null | undefined) => {
  switch (emotion) {
    case 'neutral': return 'Neutral';
    default: return 'Desconocida';
  }
}
