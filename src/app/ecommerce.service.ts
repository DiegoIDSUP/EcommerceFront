import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CookieService } from "ngx-cookie-service";
import { AngularFireAuth } from  "@angular/fire/auth";
import firebase from 'firebase/app';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  url=environment.djangourl
  create = false
  min = 60*60000
  openpay 

  constructor(public _http: HttpClient,public  firebaseAuth :  AngularFireAuth, public  router:  Router, private cookies: CookieService) {}

  async singInWithEmail(user){
    this.getsearch("sessionslogs_any","?email="+user.email).subscribe(response =>{
      let data = response.pop()
      console.log(data)
      if(response.length<1){
        this.SingIn(user,0)
        return 0
      }
      if(data.intentos>4){
        let time = new Date(Date.parse(data.release_date)+this.min)
        let t = this.Fechaconver([time.getHours(),time.getMinutes(),time.getSeconds()])
        let hora = t[0]+":"+t[1]+":"+t[2]
        if(new Date() >= time)
          this.SingIn(user,data.intentos)
        else
          alert("Su cuenta se encuentra bloqueada hasta las "+hora)
      }else{
        this.SingIn(user,data.intentos)
      }
    })
  }

  Fechaconver(datos){
    for(let i=0;i<datos.length;i++){
      if(datos[i]<10)
        datos[i]="0"+datos[i].toString()
      else{
        datos[i]=datos[i].toString()
      }
    }
    return datos
  }

  async SingIn(user,intentos){
    await this.firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(result => {
      user.password=firebase.auth().currentUser.email
      this.login(user).subscribe(response => { this.Log(response.key,"Token ","/") })
      this.Sessionlog({'email' : user.email,'action' : "Inicio de sesion exitoso",'intentos' : 0, 'release_date' : new Date()}).subscribe(response => {})
    }).catch(error => {
      if(error.code=="auth/user-not-found"){
        this.router.navigate(['/registro'])
      }if(error.code=="auth/wrong-password"){
        intentos=intentos+1
        this.Sessionlog({'email' : user.email,'action' : "Inicio de sesion erroneo",'intentos' : intentos, 'release_date' : new Date()}).subscribe(response => {})
      }
      alert(this.Errors(error))
    });
  }
  getaccessToken(credential){
    return credential.accessToken
  }
  async signInWithSocial(provider,prov){
    await this.firebaseAuth.signInWithPopup(provider).then(result => {
      this.Log(this.getaccessToken(result.credential),prov,"_social/")
      this.Sessionlog({'email' : result.user.email,'action' : "Inicio de sesion con redes sociales ("+result.credential.signInMethod+")",'intentos' : 0, 'release_date' : new Date()}).subscribe(response => {})
    }).catch(error => { alert(this.Errors(error)) });
    this.getauth("usuarios").subscribe(response => { })
  }

  async createUser(name: string, email : string, password : string) {
    this.create = true
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(result => {
      firebase.auth().currentUser.updateProfile({displayName: name ,photoURL: '../assets/usuario.png'})
      this.register({ 'email' : email, 'password1' : firebase.auth().currentUser.email, 'password2' : firebase.auth().currentUser.email }).subscribe(response => {
        this.Sessionlog({'email' : email,'action' : "Creacion de usuario",'intentos' : 0, 'release_date' : new Date()}).subscribe(response => {this.SingIn({  'email' : email, 'password' : password },0)})
      })
    })
  }

  Log(token,provider,slash){
    this.cookies.set("Usuario", JSON.stringify(firebase.auth().currentUser));
    this.cookies.set("Provider",provider);
    this.cookies.set("Token",token);
    this.cookies.set("Slash",slash);
    this.cookies.set("Carrito","");
    this.isLoggedin()
  }

  Errors(error){
    if(error.code=="auth/email-already-in-use"){
      return "El correo ya se ha registrado"
    }if(error.code=="auth/account-exists-with-different-credential"){
      return "Intente iniciar sesion con su correo"
    }if(error.code=="auth/wrong-password"){
      return "Contraseña Incorrecta"
    }if(error.code=="auth/user-not-found"){
      return "El correo no se ha registrado"
    }
  }
  async sendEmailResetPassword(email: string){
    await this.firebaseAuth.sendPasswordResetEmail(email);
  }
  async sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification()
    this.router.navigate(['/verify-email'])
  }
  
  async logout(){
    await this.firebaseAuth.signOut();
    let user = JSON.parse(this.cookies.get("Usuario"))
    this.Sessionlog({'email' : user.email,'action' : "Cierre de sesion",'intentos' : 0, 'release_date' : new Date()}).subscribe(response => {})
    this.cookies.delete("Usuario");
    this.cookies.delete("Provider");
    this.cookies.delete("Token");
    this.cookies.delete("Slash");
    this.cookies.delete("Carrito");
    window.location.reload()
  }
  isLoggedin(){
    if(this.cookies.get("Token").length>0){
      if(!this.create)
        this.router.navigate(['/inicio'])
      else
        this.sendEmailVerification()
    }
  }
  needLog(){
    if(!(this.cookies.get("Usuario").length>0)){
      this.router.navigate(['/login'])
    }else{
      this.firebaseAuth.onAuthStateChanged( user => {
        let currentUser = JSON.parse(this.cookies.get("Usuario"))
        if(user.emailVerified && !currentUser.emailVerified){
          this.cookies.set("Usuario", JSON.stringify(firebase.auth().currentUser));
          window.location.reload()
        }
      })
    }
  }
  

  get(peticion): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.get(this.url+peticion+"/", {headers: headers});
  }
  getsearch(peticion,busqueda): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.get(this.url+peticion+"/"+busqueda, {headers: headers});
	}
  getauth(peticion): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.cookies.get("Provider") + this.cookies.get("Token"));
		return this._http.get(this.url+peticion+this.cookies.get("Slash"), {headers: headers});
  }
  getauthsearch(peticion,busqueda): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.cookies.get("Provider") + this.cookies.get("Token"));
		return this._http.get(this.url+peticion+this.cookies.get("Slash")+busqueda, {headers: headers});
  }
  post(peticion,datos): Observable<any>{
		return this._http.post(this.url+peticion+"/", datos);
  }
  update(peticion,id,datos): Observable<any>{
		return this._http.patch(this.url+peticion+"/"+id+"/",datos);
  }
  postauth(peticion,datos): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.cookies.get("Provider") + this.cookies.get("Token"));
		return this._http.post(this.url+peticion+this.cookies.get("Slash"), datos, {headers: headers});
  }
  
  updateauth(peticion,id,value): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.cookies.get("Provider") + this.cookies.get("Token"));
		return this._http.put(this.url+peticion+this.cookies.get("Slash")+id+"/",value, {headers: headers});
  }
  
  deleteauth(peticion,id,): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    console.log(headers)
		return this._http.delete(this.url+peticion+"/"+id+"/", {headers: headers});
  }
  delete(peticion,id,): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.cookies.get("Provider") + this.cookies.get("Token"));
    console.log(headers)
		return this._http.delete(this.url+peticion+this.cookies.get("Slash")+id+"/", {headers: headers});
  }
  
  Sessionlog(sessionlog): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'sessionslogs_any/' , sessionlog, {headers: headers});
	}

  login(user): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'auth/login/' , user, {headers: headers});
	}
  register(user): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'registration/' , user, {headers: headers});
  }
  postcharges(datos): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization','Basic '+btoa(environment.OpenPay.private_key+':'));
		return this._http.post(environment.OpenPay.url+environment.OpenPay.merchant_id+"/charges", datos, {headers: headers});
  }
  postrefund(TRANSACTION_ID,datos): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization','Basic '+btoa(environment.OpenPay.private_key+':'));
		return this._http.post(environment.OpenPay.url+environment.OpenPay.merchant_id+"/charges/"+TRANSACTION_ID+"/refund",datos, {headers: headers});
  }
}
