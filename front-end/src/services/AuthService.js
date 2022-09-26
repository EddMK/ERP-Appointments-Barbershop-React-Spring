
const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

  async login(username, password) {
    console.log("ARRIVE SERVICE QOUTA")
    console.log("click login");
		const requestOptions = {
			method: 'POST',
			headers: {  'Accept': 'application/json', 'Content-Type': 'application/json'  },
			body: JSON.stringify({	email : username, password : password})
		};
      const response = await fetch( 'http://localhost:8080/authentication/login',requestOptions);
		  const data =  response.text();
		  console.log(data.accessToken);
      return data
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    /*
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
    */
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();