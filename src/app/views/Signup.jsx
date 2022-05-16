import React, { useCallback } from "react";
import CodeSnippet from "../components/CodeSnippet";
import { BACKEND_ADDR } from '../constants/app';

const INPUTS = {
  nickname: "nickname",
  projectName: "projectName",
  projectUrl: "projectUrl",
  contractAddress: "contractAddress",
};

const Signup = ({ onFinish }) => {
  const [nickname, setNickname] = React.useState("");
  const [projectName, setprojectName] = React.useState("");
  const [projectUrl, setprojectUrl] = React.useState("");
  const [contractAddress, setcontractAddress] = React.useState("");
  const [script, setScript] = React.useState('');
  const [verified, setVerified] = React.useState(false);

  const handleInputChange = (event) => {
    const {
      target: { name, value },
    } = event;

    switch (name) {
      case INPUTS.nickname:
        return setNickname(value);
      case INPUTS.projectName:
        return setprojectName(value);
      case INPUTS.projectUrl:
        return setprojectUrl(value);
      case INPUTS.contractAddress:
        return setcontractAddress(value);
      default:
        return null;
    }
  };

  const verifyProject = useCallback(async () => {
    const result = await verify(contractAddress)
    setVerified(true);
  }, [contractAddress])

  const handleSubmit = async () => {
    console.log({
      nickname,
      projectName,
      projectUrl,
      contractAddress,
    })

    const generatedScript = await createProject({
      url: projectUrl,
      contract: contractAddress,
      projectUrl
    })
    setScript(generatedScript || '');
  };

  return (
      <div className="container flex flex-col justify-center items-center">
        {script ? (
          <>
            <CodeSnippet
            code={script}
            onButtonClick={verified ? onFinish : verifyProject}
            buttonText={verified ? 'Done' : 'Verify site'}
          />
          </>
        ): (
          <>
          <div className="form-control">
          <form onSubmit={handleSubmit}>
            <div className="m-5">
              <label className="label">
                <span className="label-text">What should we call you?</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered"
                  name={INPUTS.nickname}
                  value={nickname}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="m-5">
              <label className="label">
                <span className="label-text">Project Name</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered"
                  name={INPUTS.projectName}
                  value={projectName}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="m-5">
              <label className="label">
                <span className="label-text">Project URL</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered"
                  name={INPUTS.projectUrl}
                  value={projectUrl}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="m-5">
              <label className="label">
                <span className="label-text">Project Contract Address</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered"
                  name={INPUTS.contractAddress}
                  value={contractAddress}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </form>
        </div>
        <button className="btn btn-primary " onClick={handleSubmit}>
          Create project
        </button>
          </>
        )}
      </div>
  );
};

export default Signup;

async function createProject({ url, contract, name }) {
  const createResult = await fetch(`${BACKEND_ADDR}/create`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        origin: url,
        contract,
        name,
    })
  })
  if (!createResult.ok) {
    alert('Failed to create project. Please make sure you are the owner of the contract');
    return;
  }

  const scriptResult = await fetch(`${BACKEND_ADDR}/generate2?address=${contract}`)
  if (!scriptResult.ok) {
    alert('Problem creating script.');
    return;
  }

  const script = await scriptResult.text();
  return script;
}

async function verify(contract) {
  const result = await fetch(`${BACKEND_ADDR}/verify?contract=${contract}`)
  if (!result.ok) {
    alert('Failed to verify site. Make sure the script is on the site and then try again.');
    return;
  }
  return result.json();
}