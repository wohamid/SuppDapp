import React from 'react':

const Signup = ({ onSubmit }) => {
  console.log("signup");

  return (
    <div>
      <div className="container flex justify-center items-center">
        <div className="form-control">
          <label className="label">
            <span className="label-text">What should we call you?</span>
          </label>
          <label className="input-group">
            <span>Nickname</span>
            <input
              type="text"
              placeholder="e.g. Napoleon"
              className="input input-bordered"
            />
          </label>
          <label className="label">
            <span className="label-text">Project Name</span>
          </label>
          <label className="input-group">
            <span>Project Name</span>
            <input
              type="text"
              placeholder="e.g. BAYC"
              className="input input-bordered"
            />
          </label>
          <label className="label">
            <span className="label-text">Project URL</span>
          </label>
          <label className="input-group">
            <span>Project URL</span>
            <input
              type="text"
              placeholder="https://..."
              className="input input-bordered"
            />
          </label>
          <label className="label">
            <span className="label-text">Project Contract Address</span>
          </label>
          <label className="input-group">
            <span>Project Contract Address</span>
            <input
              type="text"
              placeholder="0x..."
              className="input input-bordered"
            />
          </label>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default Signup;
