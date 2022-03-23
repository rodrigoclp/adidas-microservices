// fake mail tasks
// load mail lib/config

const sendMail = (options: any, templateId: string, others: any): Promise<string | Error> => {
  // load and apply the template html content
  // or something like this - in a siple way

  return new Promise((resolve, reject) => {
    const shouldResolve = 0.7 > Math.random();

    if (shouldResolve) {
      console.log(`Email has been sent to ${options.to}!`);
      return resolve('Email has been sent!');
    }

    reject(new Error(`Error on send email to ${options.to}`));
  });
};

export { sendMail };
