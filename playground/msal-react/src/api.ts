export async function retrieveData(endpoint: string, accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers
  };

  let response;

  try {
    const result = await fetch(endpoint, options);
    response = result.json();
  } catch (error) {
    console.error(error);
  }

  return response;
}
