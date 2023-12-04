const sendEmail = async (subject, email, body) => {
  const endpoint = 'http://localhost:3001/sendemail';
  const data = {
    to: email,
    subject: subject,
    text: body
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text(); // Handle non-JSON response
    }

    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error in sending email:', error);
  }
};

export default sendEmail;
