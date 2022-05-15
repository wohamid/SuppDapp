import React from "react";
import { snapId } from "./App";

const INPUTS = {
  nickname: "nickname",
  projectName: "projectName",
  projectUrl: "projectUrl",
  contractAddress: "contractAddress",
};

const Signup = ({ ethereum, onSubmit }) => {
  const [nickname, setNickname] = React.useState("");
  const [projectName, setprojectName] = React.useState("");
  const [projectUrl, setprojectUrl] = React.useState("");
  const [contractAddress, setcontractAddress] = React.useState("");

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

  const handleSubmit = async () => {
    const object = {
      // projectUrl: "https://martahj.github.io/calabasas-cave-public/",
      nickname,
      projectName,
      projectUrl,
      contractAddress,
    };

    // const response = await ethereum.request({
    //   method: "wallet_invokeSnap",
    //   params: [
    //     snapId,
    //     {
    //       method: "hello",
    //       projectUrl,
    //     },
    //   ],
    // });
    console.log(object);
    onSubmit()
  };

  return (
      <div className="container flex flex-col justify-center items-center">
        <div className="form-control">
          <form onSubmit={handleSubmit}>
            <div className="m-5">
              <label className="label">
                <span className="label-text">What should we call you?</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="e.g. Napoleon"
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
                  placeholder="e.g. BAYC"
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
                  placeholder="https://..."
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
                  placeholder="0x..."
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
          Submit
        </button>
      </div>
  );
};

export default Signup;