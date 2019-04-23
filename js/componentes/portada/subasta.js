var subasta =  {
  template: '#subasta',
  data:()=>({
    text_message:'',
    idusuario:'',
    usuario:'',
    liga_participantes_id:'',
    jugador_id:'',
    room:'',
    monto:0,
    total_monto:0,
    subasta:{},
    nombre_jugador:'',
    nacionalidad_jugador:'',
    overall_jugador:'',
    tiempo_restante:0,
    segundos_restante:0,
    interval:'',
    openEmojis:false,
    loadScrollBottom:null,
    ganando_subasta:null,
    showform:false,
    //entorno_room:'chat_subasta',
  }), 
  created:function(){
  },
  mounted:function(){
    this.connected();
    this.text_message = document.querySelector('.chat__input').innerHTML;
   
    //alert(this.text_message);
  },
  updated:function(){
    
  },
  destroyed: function() {
    console.log('my-component destroyed');
    localStorage.removeItem("subasta_reload");
  },
  methods:{
    unsetInterval(){
      console.log("unsetInterval")
      let self = this;
      clearInterval(self.interval);
    },
    connected(){
      if (typeof (Storage) !== "undefined") {
        if (isempty(localStorage.getItem("subasta_reload"))) {
          localStorage.setItem("subasta_reload", "true");
          location.reload(true);
        }else{
          this.showform=true;
        }
      } else {
        alert("Sorry, your browser does not support Web Storage...")
      }

      let self = this;
      if (!this.showform) {
        return false;
      }
        this.idusuario = document.getElementById('idusuario').value;
        this.usuario = document.getElementById('usuario').value;
        document.querySelector('.subasta_form').style.display="";
       
      //console.log("Nuevo usuario ", response);
      
      //self.liga_participantes_id = document.getElementById('mensaje_entre_componentes').getAttribute("data-liga_participantes_id");
      //self.jugador_id = document.getElementById('mensaje_entre_componentes').getAttribute("data-jugador_id");
      this.cargar_datos_subasta();
      socket_chat.on("mostrarmensaje", (response) => {
        console.log("mostrarmensaje ", response);
        this.htmlmensaje(response.idusuario,response.mensaje,response.usuario);
      });
      socket_chat.on("subasta_pujar", (response) => {
        console.log("subasta_pujar ", response);
        this.ganando_subasta = response.nombre_usuario;
        /*{liga_id:subasta.liga_id,jugador_id:subasta.jugadores_id,precio_base_jugador:subasta.monto,tiempo_restante:tiempo_subasta}*/
        this.monto = response.monto;
        this.total_monto = response.monto;
        //this.tiempo_restante = response.tiempo_restante;
        this.segundos_restante = response.tiempo_restante; 
        this.mostrarHora(response.tiempo_restante);
        if (this.usuario!=response.nombre_usuario) {
          swal("", "Han aumentando la oferta!", "warning");
        }
      });
      socket_chat.on("anunciar_ganador_subasta", (response) => {
        /*{liga_id:subasta.liga_id,jugador_id:subasta.jugadores_id,precio_base_jugador:subasta.monto,tiempo_restante:tiempo_subasta}*/
        swal("Finalizado", response.mensaje, "success");
        setTimeout(function(){
          window.location.hash='#lista-subasta';
          window.location.reload();
        }, 5000);
      });
      //llenar iconos
      for (var i = 0; i < emojis.length; i++) {
        $('.messaging .inbox_msg .emoji-wrapper').append(`<img src="`+emojis[i].image_url+`" alt="" class="emoji-img" />`);
      }
    },
    enviarmensaje(){
      this.text_message = document.querySelector('.chat__input').innerHTML;
      var msj_ = $('.chat__input').html().replace(/<div><br><\/div>/g,'').replace(/<br>/g,'').replace(/<\/div>/g,'').replace(/<i>/g,'').replace(/<\/i>/g,'').trim();
        jQuery('.chat__input').html(jQuery('.chat__input').html().replace(/<div>/g,'').replace(/<br>/g,'').replace(/<\/div>/g,'').replace(/<i>/g,'').replace(/<\/i>/g,''))
      if (!isempty(msj_.trim())) {
        msj_ = this.borrarFormatoTxt(msj_);
        msj_ = jQuery('.chat__input').html();
        socket_chat.emit('enviarmensaje',{idusuario:this.idusuario,usuario:this.usuario,mensaje:msj_,liga_id:this.subasta.liga_id,jugador_id:this.subasta.jugador_id});
        this.text_message="";
        jQuery('.chat__input').html("");
        jQuery('.chat__input').focus();
      }
    },
    htmlmensaje(idusuario,mensaje,usuario){
      console.log(idusuario,mensaje,usuario)
      let hora=moment().format('hh:mm A');
      let mi_mensaje = '<div class="outgoing_msg"><div class="sent_msg"><p>'+mensaje+'</p>  <span class="time_date">'+hora+'</span> </div></div>';
      let mensaje_otros='<div class="incoming_msg"><div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg">  <div class="received_withd_msg">  <p>'+mensaje+'</p><span class="time_date">'+hora+' | '+usuario+'</span></div></div></div>';
      if (this.idusuario!=idusuario) {
        document.getElementById("msg_history").innerHTML+=(mensaje_otros);
      }else {
        document.getElementById("msg_history").innerHTML+=(mi_mensaje);
      }
      this.onRowAdded();
    },
    cargar_datos_subasta(){
      let obj = {usuario_id:this.idusuario};
      console.log("cargar_datos_subasta");
      this.$http.post('cargar_datos_subasta?view',obj).then(function(response){
        let data = response.body;
        console.log(data.resultado);
        if (data.resultado) {
          console.log(data);
          let json_usuarios = JSON.parse(data.datos_subasta.json_usuarios); 
          this.subasta = data.datos_subasta;
          this.monto = data.datos_subasta.precio;
          this.total_monto = data.datos_subasta.precio;
          console.log(data.datos_subasta);
          this.segundos_restante = data.datos_subasta.tiempo_restante;
          this.nombre_jugador = json_usuarios.nombre;
          this.nacionalidad_jugador = json_usuarios.nacionalidad;
          this.overall_jugador = json_usuarios.overall;
          this.mostrarHora(data.datos_subasta.tiempo_restante);
          this.ganando_subasta = data.datos_subasta.nombre_usuario_ganador;
          socket_chat.emit('unirse_subasta',(data));
        }else{
          if (data.mensaje != null) {
            swal("Error", data.mensaje, "warning");
          }else{
            socket_chat.emit('unirse_subasta',(data));
          }
        }
      });
    },
    subasta_pujar(){
      swal({
        title: "",
        text: "¿Está seguro de querer realizar esta oferta?.",
        icon: "warning",
        buttons: true,
        dangerMode: false,
      })
      .then((willDelete) => {
        if (willDelete) {
          let monto = parseFloat(this.monto) + 5;
          if (parseFloat(monto)>parseFloat(this.total_monto))
          {
            let obj = {subasta_id:this.subasta.id,jugador_id:this.subasta.jugador_id,monto:monto,usuario_id:this.idusuario,liga_id:this.subasta.liga_id,nombre_usuario:this.usuario};
            console.log(obj)
            this.$http.post('subasta_pujar?view',obj).then(function(response){
              let data = response.body;
              console.log(data);
              if (data.resultado) 
              {
                this.total_monto = data.data_subasta.monto;
                this.monto =data.data_subasta.monto;
                socket_chat.emit('subasta_pujar',(data.data_subasta));
              }else{
                if (data.mensaje != null) {
                  swal("Error", data.mensaje, "error");
                }else{
                  socket_chat.emit('subasta_pujar',(data.data_subasta));
                }
              }
            });
          }else{
            swal("Error", "El monto tiene que superar la oferta actual", "warning");
          }
        }
      });  
      
    },
    mostrarHora(time){
      var self = this;
      console.log(self.segundos_restante);
      this.unsetInterval();
      this.interval = setInterval(function(){
        var horas = Math.floor( self.segundos_restante / 3600 );  
        var minutos = Math.floor( (self.segundos_restante % 3600) / 60 );
        var segundos = self.segundos_restante % 60;
        if(horas < 10) { horas = '0' + horas; }
        if(minutos < 10) { minutos = '0' + minutos; }
        if(segundos < 10) { segundos = '0' + segundos; }
        if (horas==0 && minutos==0 && segundos==0) {
          console.log("clearInterval");
          clearInterval(self.interval);
        }
        console.log(horas+':'+minutos+':'+segundos);

        self.tiempo_restante = horas+':'+minutos+':'+segundos;
        self.segundos_restante=self.segundos_restante - 1;
      }, 1000);
    },
    remover_mensaje_entre_componentes(){
      var input = document.getElementById("mensaje_entre_componentes"); 
      input.parentNode.removeChild(input)
    },
    mostrar_emoticon(){
      console.log("mostrar_emoticon")
      var $this=$('.input_msg_write .btn-send-emoji .emoji-popup .emoji-wrapper').find('img:hover');
      if ($this.length>0) {
          let $input_box=$('.input_msg_write .chat__input');
          var texto = $input_box.html().replace('Escriba su mensaje...','');
          $input_box.html(texto);
          if (!$input_box.parent('div').hasClass('input-focused')) {
          }
          $input_box.append(`<img src="`+$this.attr('src')+`" alt="" class="emoji-img" />`);
          $input_box.find(".emoji-img").css({width:'25px','border-radius':'25px'});
      }
    },
    borrarFormatoTxt(texto){
      var aux = document.createElement("input");
      aux.setAttribute("value", (texto).toString());
      document.body.appendChild(aux);
      aux.select();
      var x = aux.value;
      document.body.removeChild(aux);
      return x;
  },
onRowAdded() {
  console.log("onRowAdded")
  var self = this;
  clearTimeout(self.loadScrollBottom)
  this.loadScrollBottom = setTimeout(function(){
           $('.msg_history').animate({
          scrollTop: $('.msg_history').prop('scrollHeight')
        });
    },150)

},
rendirse_subasta(){
  if (this.ganando_subasta==this.usuario) {
    swal("Error","No puedes rendirte mientras estes ganando la subasta.","warning");
    return false;
  }
  swal({
    title: "",
    text: "¿Está seguro de querer abandonar la subasta, no podrá regresar?.",
    icon: "warning",
    buttons: true,
    dangerMode: false,
  })
  .then((willDelete) => {
    if (willDelete) {
      let obj = {subasta_id:this.subasta.id,jugador_id:this.subasta.jugador_id,usuario_id:this.idusuario,liga_id:this.subasta.liga_id,nombre_usuario:this.usuario};
    this.$http.post('rendirse_subasta?view',obj).then(function(response){
      let data = response.body;
      console.log(data);
      if (data.resultado) {
        if (data.ganador_default!=null) {
          socket_chat.emit('rendirse_subasta',(data));
        }
        swal("","Te acabas de retirar de la subasta.","success");
        setTimeout(() => {
          window.location.hash='#lista-subasta';
          window.location.reload();
        }, 2000);
      }else {
        swal("Error","Ha ocurrido un error al rendirse en la subasta.","warning");
      }
    });
    }
    
  });
    
    }
  }
}