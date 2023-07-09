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
          "flex flex-col md:flex-row justify-start items-between gap-[50px] bg-indigo-900",
          "p-[3rem] text-justify border-b-2 border-white"
        )
      }
    >
      <div className="flex-col justify-start items-start lg:max-w-[40%] text-white">
        <h1
          className="font-bold text-xl"
        >
          Acerca del sistema
        </h1>
        <br />
        <span>
          El presente sistema se encuentra desarrollado usando principalmente las tecnologías de
          Python, OpenCV y TensorFlow. El objetivo principal es servir de soporte en la identificación
          de emociones en menores lo cual puede ser una tarea un poco compleja si no se tiene la
          experiencia suficiente.
        </span>
        <br />
        <br />

        <div className="flex gap-4 flex-row flex-wrap justify-center items-center">
          <Avatar
            alt="UTM logo"
            src="/utm-logo.png"
            style={{
              width: "150px",
              height: "150px",
            }}
          />
          <img
            alt="UTM logo"
            src="/fci.png"
            style={{
              width: "130px",
              height: "150px",
            }}
          />
        </div>
        <br />

        <small>Universidad Técnica de Manabí</small>
        <br />
        <small>Facultad de Ciencias Informáticas © 2023</small>
      </div>
      <div className="flex-col justify-start items-start text-white">
        <h1
          className="font-bold text-xl min-w-[300px]"
        >
          Tutor responsable
        </h1>
        <br />
        <div className="flex flex-row justify-center">
          <Avatar
            alt="Remy Sharp"
            src="/chancay.jpg"
            style={{
              width: "150px",
              height: "150px",
            }}
          />
        </div>
        <span>
          Ing. Leonardo Javier Chancay García, Ph.D
        </span>
        <br />
      </div>
      <div className="flex-col justify-start items-start text-white">
        <h1
          className="font-bold text-xl"
        >
          Desarrolladores
        </h1>
        <br />
        <span>
          El sistema fue desarrollado por estudiantes de la Universidad Técnica de Manabí como proyecto final de la carrera de ingeniería en sistemas de información
        </span>
        <br />
        <br />
        <div
          className="flex flex-row flex-wrap justify-center gap-4"
        >
          <div className="flex flex-col justify-center items-center gap-4">
            <Avatar alt="Remy Sharp" src="/valeriano.jpg" style={{ width: "100px", height: "100px" }} />
            <span className="text-center">
              Valeriano Saldarriaga Ricardo
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-4">
            <Avatar alt="Remy Sharp" src="/zamora.jpg" style={{ width: "100px", height: "100px" }} />
            <span className="text-center">
              Zamora Ponce Ronny
            </span>
          </div>
        </div>
        <br />
      </div>
      <div className="flex-col justify-start items-start text-white"></div>
    </footer>
  </>
}

export default HomeScreen;
