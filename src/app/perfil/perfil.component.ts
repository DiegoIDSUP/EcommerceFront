import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EcommerceService } from '../ecommerce.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  title = "Perfil"
  user
  datosv
  productos
  pedidos
  solitudes
  reportes
  domicilios
  logs
  fillv = false
  fills = false
  fillr = false
  filld = false
  fillp = false
  fillped = false
  vendedor = false
  admin = false
  report = false
  editv=false
  formprod=false
  editprod=false
  domform=false
  msnprod
  msndom
  vendedorForm : FormGroup
  productoForm : FormGroup
  reporteForm : FormGroup
  domicilioForm : FormGroup
  userbd

  constructor(public ecommerceService : EcommerceService, public  router:  Router, private _builder : FormBuilder, private cookies: CookieService) {
    ecommerceService.needLog()
    this.user=JSON.parse(this.cookies.get("Usuario"))
    this.vendedorForm = this._builder.group({
      user : ['',],
      verified : [false,],
      nombre : ['', Validators.required],
      estado : ['', Validators.required],
      ciudad : ['', Validators.required],
      rfc : ['',],
    })
    ecommerceService.getauthsearch("usuarios","?email="+this.user.email).subscribe(response => {
      this.admin=response[0].is_superuser
      this.userbd=response[0]
      ecommerceService.getauthsearch("domicilios","?user="+this.userbd.id).subscribe(response => {
        if(response.length>0){
          this.domicilios=response
        }
      })
      if(this.admin){
        ecommerceService.getauth("sessionslogs").subscribe(response => {
          this.logs=response
          this.admin = true
        })
        ecommerceService.getauthsearch("vendedores","?verified=false").subscribe(response => {
          if(response.length>0){
            this.fills = true
            this.solitudes = response
            for(let i=0; i<response.length;i++){
              this.ecommerceService.getauthsearch("usuarios",response[i].user+"/").subscribe(response => {
                this.solitudes[i]={...this.solitudes[i],'email' : response.email}
                if(this.solitudes[i].rfc.length<1){
                  this.solitudes[i].rfc="No hay RFC"
                }
              })
            }
          }
        })
        ecommerceService.getauth("reportes").subscribe(response => {
          if(response.length>0){
            this.fillr = true
            this.reportes=response
            for(let i=0; i<response.length;i++){
              this.ecommerceService.getauthsearch("usuarios",response[i].user+"/").subscribe(response => {
                this.reportes[i]={...this.reportes[i],'email' : response.email}
              })
              this.ecommerceService.getsearch("productos",response[i].producto+"/").subscribe(response => {
                this.reportes[i]={...this.reportes[i],'nombre' : response.nombre,'showp' : response.show}
              })
            }
          }
        })
      }
      ecommerceService.getauthsearch("vendedores","?user="+this.userbd.id).subscribe(response => {
        this.productoForm = this._builder.group({
          user : [this.userbd.id,],
          nombre : ['', Validators.required],
          descripcion : ['', Validators.required],
          stock : ['', Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required])],
          precio : ['', Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required])],
          imagen: ['',],
          show : [true,]
        })
        this.reporteForm = this._builder.group({
          comentario : ['',Validators.required],
          producto : ['',]
        })
        if(response.length>0){
          this.fillv=true
          this.datosv=response[0]
          this.vendedor=this.datosv.verified
          this.vendedorForm.disable()
          this.vendedorForm = this._builder.group({
            user : [this.datosv.user,],
            verified : [this.datosv.verified,],
            nombre : [this.datosv.nombre, Validators.required],
            estado : [this.datosv.estado, Validators.required],
            ciudad : [this.datosv.ciudad, Validators.required],
            rfc : [this.datosv.rfc,],
          })
          this.ecommerceService.getsearch("productos","?user="+this.userbd.id).subscribe(response => {
            this.productos= response
            if(this.productos.length>0){
              this.fillp=true
            }
          })
          this.ecommerceService.getauthsearch("pedidos","?user="+this.userbd.id).subscribe(response => {
            if(response.length>0){
              this.pedidos= response
              this.fillped=true
              if(this.fillped){
                console.log(this.pedidos)
                for(let i=0; i<this.pedidos.length;i++){
                  for(let producto of this.productos){
                    if(producto.id==this.pedidos[i].producto){
                      this.pedidos[i]={...this.pedidos[i],'img' : producto.imagen,'name':producto.nombre}
                      break
                    }
                  }
                }
              }
            }  
          })
        }
      })
    })
  }

  ngOnInit(): void { }
  
  fecha(date){
    let dias=["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"]
    let fecha = new Date(date)
    let DMY=this.ecommerceService.Fechaconver([fecha.getDate(),fecha.getMonth(),fecha.getFullYear(),fecha.getHours(),fecha.getMinutes(),fecha.getSeconds(),fecha.getMilliseconds()])
    return dias[(fecha.getDay()-1)]+" "+DMY[0]+"/"+DMY[1]+"/"+DMY[2]+" a las "+DMY[3]+":"+DMY[4]+":"+DMY[5]+":"+DMY[6]
  }
  AutorizarVendedor(value){
    let sure=confirm("Seguro que deseas hacer vendedor a "+value.nombre+" con email: "+value.email)
    if(sure){
      value.verified=true
      delete value['email']
      this.ecommerceService.updateauth("vendedores",value.id,value).subscribe(response => { window.location.reload() })
    }
  }
  EliminarSolicitud(value){
    let sure=confirm("Seguro que deseas eliminar la solicutud del vendedor "+value.nombre+" con email: "+value.email)
    if(sure){
      delete value['email']
      this.ecommerceService.delete("vendedores",value.id).subscribe(response => { window.location.reload() })
    }
  }
  solicitarvendedor(value){
    if(!this.fillv){
      if(this.user.emailVerified){
        value.user=this.userbd.id
        this.ecommerceService.postauth("vendedores",value).subscribe(response => {
          window.location.reload()
        })
      }else{
        alert("Para ser un vendedor debes verificar el email")
      }
    }else{
      if(this.datosv.verified){

      }else{
        alert("Tu solicitud todavia esta pendiente intentalo despues, si tu informacion desaparece significa que tu solicitud fue rechazada")
      }
    }
  }
  Editardatosv(value){
    if(this.datosv.nombre==value.nombre && this.datosv.estado==value.estado && this.datosv.ciudad==value.ciudad && this.datosv.rfc==value.rfc){
      this.editv=false
    }else{
      this.ecommerceService.updateauth("vendedores",this.datosv.id,value).subscribe(response => { window.location.reload() })
      window.location.reload()
    }
  }
  
  filesToUpload;
  onChange(event) {
    console.log(event)
    this.filesToUpload = event.target.files[0];
    this.productoForm.get("imagen").setValue("fill")
  }

  getFormData(value, image){
    var formData = new FormData();
    formData.append('user',value.user);
    formData.append('nombre',value.nombre);
    formData.append('descripcion',value.descripcion);
    formData.append('stock',value.stock);
    formData.append('precio',value.precio);
    formData.append('show',value.show);
    if(image){
      console.log(this.filesToUpload.name)
      var name= new Date().getTime().toString()+"_"+value.user+this.filesToUpload.name.substring(this.filesToUpload.name.length-4,this.filesToUpload.name.length)
      formData.append('imagen',this.filesToUpload, name);
    }
    return formData
  }

  SubirProducto(value){
    console.log(value)
    if(this.editprod){
      if(value.imagen=="fill"){
        this.ecommerceService.update("productos",value.id,this.getFormData(value,true)).subscribe(response => {window.location.reload()})
      }else{
        this.ecommerceService.update("productos",value.id,this.getFormData(value,false)).subscribe(response => {window.location.reload()})
      }
      console.log(value)
    }else{
      if(value.imagen==""){
        alert("No ha ingresado una imagen")
      }else{
        this.ecommerceService.post("productos",this.getFormData(value,true)).subscribe(response => { window.location.reload()})
      }
    }
    
  }
  EditProd(value){
    this.editprod=true
    this.formprod=true;
    this.msnprod="Editar Producto"
    this.productoForm = this._builder.group({
      id : [value.id,],
      user : [this.userbd.id,],
      nombre : [value.nombre, Validators.required],
      descripcion : [value.descripcion, Validators.required],
      stock : [value.stock, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required])],
      precio : [value.precio, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required])],
      imagen: [value.imagen,],
      show : [value.show,]
    })
  }
  Addprod(){
    this.editprod=false
    this.formprod=true;
    this.msnprod="Añadir Producto"
    this.productoForm = this._builder.group({
      user : [this.userbd.id,],
      nombre : ['', Validators.required],
      descripcion : ['', Validators.required],
      stock : ['', Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required])],
      precio : ['', Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required])],
      imagen: ['',],
      show : [true,]
    })
  }

  Retirareporte(value){
    let sure=confirm("Seguro que deseas eliminar el reporte del producto "+value.nombre+" echo por: "+value.email)
    if(sure){
      delete value['email']
      this.ecommerceService.delete("reportes",value.id).subscribe(response => { window.location.reload() })
    }
  }
  penalizaruser(value){
    let sure=confirm("Seguro que deseas ocultar el producto "+value.nombre)
    if(sure){
      this.borrarEquals(value)
      this.ecommerceService.update("productos",value.producto,{'show' : false}).subscribe(response => { window.location.reload() })
    }
  }
  despenalizar(value){
    let sure=confirm("Seguro que deseas volver a mostrar el producto "+value.nombre)
    if(sure){
      this.borrarEquals(value)
      this.ecommerceService.update("productos",value.producto,{'show' : true}).subscribe(response => { window.location.reload() })
    }
  }
  borrarEquals(value){
    this.ecommerceService.getauthsearch("reportes","?producto="+value.producto).subscribe(response => { 
      console.log(response.length)
      console.log(response)
      if(response.length>1){
        for(let res of response){
          this.ecommerceService.delete("reportes",res.id).subscribe(response => {})
        }
      }else{
        this.ecommerceService.delete("reportes",value.id).subscribe(response => {})
      }
     })
  }
  addDomicilio(){
    this.msndom="Crear Domicilio"
    this.domform=true
    this.filld=false
    this.domicilioForm = this._builder.group({
      user : [this.userbd.id,],
      calle : ['', Validators.required],
      num : ['', Validators.required],
      numInt : ['',],
      referencia : ['',],
      colonia : ['', Validators.required],
      cp : ['', Validators.required],
      ciudad : ['', Validators.required],
      estado : ['', Validators.required],
    })
  }
  editarDom(value){
    this.msndom="Editar Domicilio"
    this.domform=true
    this.filld=true
    this.domicilioForm = this._builder.group({
      id : [value.id,],
      user : [this.userbd.id,],
      calle : [value.calle, Validators.required],
      num : [value.num, Validators.required],
      numInt : [value.numInt,],
      referencia : [value.referencia,],
      colonia : [value.colonia, Validators.required],
      cp : [value.cp, Validators.required],
      ciudad : [value.ciudad, Validators.required],
      estado : [value.estado, Validators.required],
    })
  }
  CrearDomicilio(value){
    if(this.filld){
      let id=value.id
      delete value['id']
      this.ecommerceService.updateauth("domicilios",id,value).subscribe(response => { window.location.reload() })
    }else{
      this.ecommerceService.postauth("domicilios",value).subscribe(response => { window.location.reload() })
    }
    
  }
  eliminarDomicilio(value){
    let sure=confirm("Seguro que desea borrar el domicilio "+value.calle+" #"+value.num+" de la colonia "+value.colonia+" ubicado en "+value.ciudad+", "+value.estado)
    if(sure){
      this.ecommerceService.delete("domicilios",value.id).subscribe(response => {window.location.reload() })
    }
  }
  deleteProd(value){
    let sure=confirm("Seguro que desea borrar el producto "+value.nombre)
    if(sure){
      this.ecommerceService.delete("productos",value.id).subscribe(response => {window.location.reload() })
    }
  }
  openReport(value){
    console.log(value)
    this.report=true
    this.reporteForm = this._builder.group({
      comentario : ['',Validators.required],
      producto : [value,]
    })
  }
  Reportar(value){
    this.ecommerceService.postauth("reportes",{"user" : this.userbd.id ,"producto" : value.producto , "comentario" : value.comentario}).subscribe(response => {
      this.report=false
      this.reporteForm = this._builder.group({
        comentario : ['',Validators.required],
        producto : [value,]
      })
    })
  }
}