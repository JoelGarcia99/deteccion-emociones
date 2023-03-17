import { PlayCircleFilled } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import classMerge from "../../core/utils/class_merge";
import RouteNames from "../routes/names.route";
import MediaCard from "../shared_widgets/Card";
import AppBarComponent from "../shared_widgets/Navbar";

const HomeScreen = () => {

  const navigator = useNavigate();

  return <>
    <AppBarComponent />
    <div
      id="info-banned"
      style={{
        backgroundImage: "url('rrz1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={
        classMerge(
          "flex flex-col justify-center items-center",
          "p-[5rem]",
        )
      }
    >
      <div
        className={
          classMerge(
            "flex flex-col justify-center items-center",
            "bg-white bg-opacity-50",
            "w-full h-full py-[5rem]"
          )
        }
      >
        <h1
          className={
            classMerge(
              "text-[3rem] text-center font-bold",
            )
          }
        >
          Bienvenido al sistema de detección de emociones
        </h1>
        <hr />
        <span>Herramienta de aprensizaje automático para la detección de emociones</span>
        <br />
        <br />
        <br />
        <br />
        <Button
          variant="contained"
          startIcon={<PlayCircleFilled />}
          onClick={() => navigator(RouteNames.PROCESS)}
        >
          Empezar
        </Button>
      </div>

    </div>
    <div
      id="cores"
      className={
        classMerge(
          "flex flex-col justify-start items-center p-[5rem]",
          "bg-blue-500 text-white text-center text-[2rem] font-bold"
        )
      }
    >
      <h1
        className={
          classMerge(
            "border-b-2 border-white"
          )
        }
      >
        PIEZAS CLAVE DEL SISTEMA
      </h1>
      <hr />
      <div
        className={
          classMerge(
            "flex flex-row justify-center items-stretch",
            "py-[2rem] flex-wrap gap-4"
          )
        }
      >
        <MediaCard
          title="Machine learning"
          description="El sistema utiliza un modelo preentrenado de aprendizaje automático para la detección de emociones basado en Tensorflow."
          targetUrl="https://www.tensorflow.org/js/models"
          imageUrl="https://www.tensorflow.org/images/tf_logo_social.png"
        />
        <MediaCard
          title="OpenCV"
          description="Utilizamos la librería OpenCV para la detección de rostros en las imágenes y realizar el procesamiento de las mismas."
          targetUrl="https://opencv.org/"
          imageUrl="https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo-1.png"
        />
        <MediaCard
          title="Módulo estadístico"
          description="El sistema mantendrá un registro de las emociones detectadas a través del tiempo y las mostrará en un gráfico estadístico usando Matplotlib."
          targetUrl="https://matplotlib.org/"
          imageUrl="https://matplotlib.org/_static/logo2_compressed.svg"
        />
      </div>
    </div>
    <footer
      className={
        classMerge(
          "flex flex-col md:flex-row justify-start items-between gap-4 bg-indigo-900",
          "p-[5rem]"
        )
      }
    >
      <div className="flex-col justify-start items-start text-white">
        <h1
          className="font-bold text-xl"
        >
          Acerca del sistema
        </h1>
        <br />
        <span>
          El sistema fue desarrollado por estudiantes de la Universidad Técnica de Manabí como proyecto final de carrera
        </span>
        <br />
        <br />

        <small>Universidad Técnica de Manabí</small>
        <br />

        <small>Facultad de Ciencias Informáticas ©</small>
      </div>
      <div className="flex-col justify-start items-start text-white">
        <h1
          className="font-bold text-xl min-w-[300px]"
        >
          Tutor responsable
        </h1>
        <br />
        <span>
          Leonardo Javier Chancay García, Ph.D
        </span>
        <br />
        <br />

        <small>Universidad Técnica de Manabí</small>
        <br />

        <small>Facultad de Ciencias Informáticas ©</small>
      </div>
      <div className="flex-col justify-start items-start text-white">
        <h1
          className="font-bold text-xl"
        >
          Desarrolladores
        </h1>
        <br />
        <span>
          El sistema fue desarrollado por estudiantes de la Universidad Técnica de Manabí como proyecto final de la carrera de ingeniría en sistemas de información
        </span>
        <br />
        <br />
        <div className="flex flex-row items-center gap-4">
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />&nbsp;Nombre1 Apellido1 Apellido2
        </div>
        <br />

        <div className="flex flex-row items-center gap-4">
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />&nbsp;Nombre1 Apellido1 Apellido2
        </div>

      </div>
      <div className="flex-col justify-start items-start text-white"></div>
    </footer>
  </>
}

export default HomeScreen;
