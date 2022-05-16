const CodeSnippet = ({ code, onButtonClick, buttonText }) => {
  return !code ? null : (
    <div className="hero rounded w-full">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">Congratulations!</h1>
          <p className="py-3">{`Congratulations, you registered your project on suppdapp successfully.`}</p>
          <p className="py-3">{`Please copy the code provided below and paste it on your website, before the closing tag </body>`}</p>
          <p className="py-3">{`Press Get Started and start managing your tickets from your dashboard`}</p>
          <div class="mockup-code p-5">
            <code>{code}</code>
          </div>
          <button className="btn btn-primary my-10" onClick={onButtonClick}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet;
