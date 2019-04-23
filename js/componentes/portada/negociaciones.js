var negociaciones= {
    template: '#negociaciones',
    data:()=>({
        total_compras : 0,
        total_ventas : 0,
        saldo_disponible : 0,
        compras:[],
        ventas:[],
        datos_liga:[],

        mostrar:false,
        mensaje:null,
        mostrar_compras:false,
        mostrar_ventas:false


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
                    if(this.datos_liga.temporada_estado==2){

                        this.mostrar = false;
                        this.mensaje = 'Todavía no inicia la temporada';
                    }else{

                        this.cargar_negociaciones();

                    }
                    console.log(this.datos_liga);


                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });
        },
        cargar_negociaciones(){
            this.$http.post('cargar_negociaciones?view',{liga_participantes_id:this.datos_liga.liga_participantes_id, temporada_liga_id:this.datos_liga.temporada_id}).then(function(response){
                if( response.body.resultado ){
                    this.mostrar= true;
                    this.compras = response.body.compras;
                    for (let index = 0; index < this.compras.length; index++) {

                        this.compras[index].fecha_edicion=  moment(this.compras[index].fecha_edicion).format('DD-MM-YYYY');
                    }
                    console.log(this.compras);
                    this.ventas = response.body.ventas;
                    console.log(this.ventas);
                    for (let index = 0; index < this.ventas.length; index++) {

                        this.ventas[index].fecha_edicion=  moment(this.ventas[index].fecha_edicion).format('DD-MM-YYYY');
                    }
                    this.total_compras = (response.body.total_compras).toFixed(2);
                    this.total_ventas = (response.body.total_ventas).toFixed(2);
                    this.saldo_disponible = (parseFloat(response.body.saldo_disponible)).toFixed(2);

                }else{
                    this.mensaje = "No hay negociaciones registradas"
                    this.mostrar= false;
                }

            });
        },
        ver_compras(){

            this.mostrar_ventas = false;
            this.mostrar_compras = true;
        },
        ver_ventas(){
            console.log("dfghjkl")
            this.mostrar_compras = false;
            this.mostrar_ventas = true;
        }
    }
  }