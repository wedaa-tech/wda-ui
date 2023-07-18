import { useHistory } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import azure from "../../src/assets/Azure.png";
import aws from "../../src/assets/aws.png";
import minikube from "../../src/assets/mini.jpeg";
import Footer from "../components/Footer";

function Projects() {
  const history = useHistory();

  const [data, setData] = useState([]);
  const { keycloak, initialized } = useKeycloak();

  const handleClick = (data, column, name) => {
    console.log(data);
    if (column === "Architecture")
      history.push({
        pathname: "/projects/" + name,
        state: data,
      });
    else
      history.push({
        pathname: "/projects/" + name,
        state: data,
      });
  };
  useEffect(() => {
    if (initialized) {
      fetch(process.env.REACT_APP_API_BASE_URL + "/api/blueprints", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setData(result.data);
        })
        .catch((error) => console.error(error));
    }
  }, [initialized, keycloak]);

  return (
    <div>
      <TableContainer sx={{ margin: "5%" }}>
        <Table size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>S.No</Th>
              <Th>Project</Th>
              <Th>Infrastructure</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((project, index) => {
              return (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      variant="link"
                      onClick={(e) =>
                        handleClick(
                          project.metadata,
                          "Architecture",
                          project.projectName
                        )
                      }
                      _hover={{
                        transform: "scale(1.1)",
                        transition: "transform 0.3s",
                        fontWeight: "bolder",
                        color: "red",
                      }}
                    >
                      {project.projectName}
                    </Button>
                  </Td>
                  {project.metadata?.deployment ? (
                    <Td>
                      <Button
                        colorScheme="teal"
                        variant="link"
                        onClick={(e) =>
                          handleClick(
                            project.metadata?.deployment,
                            "Infrastructure",
                            project.projectName
                          )
                        }
                        _hover={{
                          transform: "scale(1.1)",
                          transition: "transform 0.3s",
                          fontWeight: "bolder",
                          color: "red",
                        }}
                      >
                        {project.metadata.deployment.cloudProvider ===
                        "azure" ? (
                          <img width="40px" src={azure} />
                        ) : project.metadata.deployment.cloudProvider ===
                          "aws" ? (
                          <img width="40px" src={aws} />
                        ) : (
                          <img width="40px" src={minikube} />
                        )}
                      </Button>
                    </Td>
                  ) : (
                    <Td>
                      <span style={{ lineHeight: "40px" }}>NA</span>
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Footer />
    </div>
  );
}

export default Projects;
