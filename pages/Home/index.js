import * as s from "../../styles/HomeStyles/index";
import { useEffect, useState } from "react";
import postAcessToken from "../../src/api/accessUsers";
import NotLogged from "../../src/components/notLogged";
import EtapasAnalise from "../../src/components/etapasAnalise";
import { v4 as uuidv4 } from "uuid";
import { BsCheck2All } from "react-icons/bs";
import ShadowBanTrue from "../../src/components/shadowBanTrue";
import ShadowBanFalse from "../../src/components/shadowBanFalse";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, getUser] = useState([]);
  const [step, setStep] = useState(0);
  const [verify, getVerify] = useState(false);
  const [shadowBan, getShadowBan] = useState(null);
  const uuid = uuidv4();

  const responseFacebook = (response) => {
    if (response.status != "unknown") {
      setIsLoggedIn(true);
      getUsers(response.accessToken);
    }
  };

  async function getUsers(accessToken) {
    const userData = await postAcessToken(accessToken);
    if (userData.result.message === "Perfil sem shadowban!") {
      setStep(1);
      getShadowBan(false);
    }
  }

  console.log("Usuário", user);

  return (
    <div className="App">
      {isLoggedIn === true ? (
        <s.containerHome>
          <s.containerLogin>
            <h1>Analisando sua conta</h1>
            <figcaption>Isso pode demorar alguns segundos...</figcaption>
            {verify === false ? (
              <s.loader />
            ) : (
              <BsCheck2All fill="#09b109" size={36} />
            )}
            <s.containerEtapa>
              <EtapasAnalise
                id={uuid}
                title="Verificando se o perfil existe"
                sniper={step >= 3}
              />
              <EtapasAnalise
                id={uuid}
                title="Buscando foto mais recente ultilizando hashtag"
                sniper={step >= 2}
              />
              <EtapasAnalise
                id={uuid}
                title="Analisando Shadowban..."
                sniper={step >= 1}
              />
              {/* {shadowBan === true ? <ShadowBanTrue /> : <ShadowBanFalse />} */}
            </s.containerEtapa>
          </s.containerLogin>
        </s.containerHome>
      ) : (
        <s.containerHome>
          <s.containerLogin>
            <NotLogged responseFacebook={responseFacebook} />
          </s.containerLogin>
        </s.containerHome>
      )}
    </div>
  );
}
