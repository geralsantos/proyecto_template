var lista_subasta = {
  template: '#lista-subasta',
  data:()=>({
    //entorno_room:'chat_subasta',
    lista_jugadores:[],
    lista_ligas:[],
    liga:'',
    mostrar:false,
    mensaje:'',
    datos_liga:[]

  }),
  created:function(){
  },
  mounted:function(){

    this.cargar_datos_usuario();
    //this.cargar_ligas_usuario();
  },
  methods:{
    cargar_ligas_usuario(){
      this.$http.post('cargar_ligas_usuario?view').then(function(response){
        let data = response.body;
        console.log(data);
        if( data.resultado ){
          this.lista_ligas=data.ligas;
          this.liga = data.ligas[0].liga_id;
        }else{
          swal("Sin Ligas", "Por ahora usted no cuenta con ligas creadas activas", "warning");
        }
      });
    },
    cargar_datos_usuario(){

      this.$http.post('cargar_datos_usuario?view',{}).then(function(response){
          if( response.body.resultado ){
              this.datos_liga = response.body.data;

              console.log(this.datos_liga);
              if(this.datos_liga.temporada_estado == 4 ){
                this.cargar_jugadores_subastas();
              }else{
                  this.mostrar = false;
                  this.mensaje = "No estas en período de subastas."
              }
          }else{
              this.mensaje = "No perteneces a ninguna liga"
              this.mostrar= false;
          }
      });

    },
    unirse_subasta(params){
      console.log(params);

      let obj = {liga_id:params.liga_id,jugador_id:params.jugadores_id,precio_base_jugador:params.precio_base_jugador};
      this.$http.post('unirse_subasta?view',obj).then(function(response){
        let data = response.body;
        console.log(data);
        if (data.resultado) {
         // this.mensaje_entre_componentes(params.liga_id,params.jugadores_id);
        location.href = SITE_URL_DIR+'/portada/index#/subasta';
        
        }else{
          swal("Error", data.mensaje, "warning");
        }
      });
    },
    cargar_jugadores_subastas(){
      this.$http.post('cargar_jugadores_subastas?view').then(function(response){
        let data = response.body;
        console.log(data);
        if( data.resultado ){
          this.lista_jugadores=data.jugadores;
          this.mostrar= true;
        }else{
          this.mensaje = "No cuentas con jugadores en subastas"
          this.mostrar= false;

        }
      });
    },
    ver_jugador_subasta(){
      this.$http.post('ver_jugador_subasta?view').then(function(response){
        let data = response.body;
        if( data.resultado ){
          this.lista_jugadores=data.jugadores;
          }
      });
    },
    mensaje_entre_componentes(liga_participantes_id,jugador_id){
      var input = document.createElement("input");
      input.type = "hidden";
      input.id = "mensaje_entre_componentes";
      input.setAttribute("data-liga_participantes_id",liga_participantes_id);
      input.setAttribute("data-jugador_id",jugador_id);
      document.body.appendChild(input); // put it into the DOM
    }
  }
}