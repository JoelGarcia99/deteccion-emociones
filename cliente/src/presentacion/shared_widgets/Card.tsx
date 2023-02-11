import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface MediaCardProps {
  title: string;
  description: string;
  targetUrl: string;
  imageUrl: string;
}

export default function MediaCard({
  title, description, targetUrl, imageUrl
}: MediaCardProps) {
  return (
    <Card sx={{ maxWidth: 345, }}>
      <CardMedia
        sx={{ marginTop: 3, height: 140, backgroundSize: 'contain' }}
        image={imageUrl}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign={"justify"}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => window.open(targetUrl, '_blank')}
          size="small"
        >
          Aprender más
        </Button>
      </CardActions>
    </Card>
  );
}

