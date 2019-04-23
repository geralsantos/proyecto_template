var liga_partidos = {
    template: '#liga-partidos',
    data:()=>({

        partidos: [],
        datos_liga:[],
        mostrar:false,
        mensaje:null


    }),
    created:function(){
    },
    mounted:function(){
        this.cargar_datos_usuario();
    },
    updated:function(){

    },
    methods:{
        cargar_datos_usuario(){
            this.$http.post('cargar_datos_usuario?view',{}).then(function(response){
                if( response.body.resultado ){
                    this.datos_liga = response.body.data;
                    console.log(this.datos_liga);

                    this.cargar_partidos_liga();
                }else{

                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar=false;
                }
            });
        },
        cargar_partidos_liga(){
            this.$http.post('cargar_partidos_liga?view',{tabla:'partidos_liga', temporada_liga_id:this.datos_liga.temporada_id}).then(function(response){

                if( response.body.resultado ){
                    this.mostrar=true;
                    this.partidos = response.body.data;
                    console.log(this.partidos);
                }else{
                    this.mensaje = "Todavía no han generado los partidos";
                    this.mostrar=false;

                }
            });
        }

    }
  }