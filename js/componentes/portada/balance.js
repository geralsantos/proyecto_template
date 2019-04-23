var balance = {
    template: '#balance',
    data:()=>({

        equipos:[],
        equipo:[],

        premios:[],
        premio:0,
        gastos:[],
        gasto:0,
        saldo_disponible:0,
        mostrar_premios : false,
        mostrar_gastos: false,
        mostrar:false,
        mensaje:null,
        mostrar_2:false,

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
                    if(this.datos_liga.temporada_estado==2){
                        this.mensaje = "Todavía no inicia la temporada"
                        this.mostrar= false;
                    }else{
                        this.cargar_equipos();
                        this.mostrar= true;
                    }


                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });

        },
        cargar_equipos(){
            this.equipos=[];
            this.equipo=[];
            this.premios=[];
            this.premio=0;
            this.gastos=[];
            this.gasto=0;
            this.saldo_disponible=0;
            this.mostrar_premios=false;
            this.mostrar_gastos=false;
            this.$http.post('cargar_equipos_historial?view',{}).then(function(response){
                if( response.body.resultado ){
                    this.equipos= response.body.equipos;


                }else{
                    swal("Error", "Un error ha ocurrido", "danger");
                }
            });
        },



        cargar_premios(){
            if(this.equipo.estado ==2){
                swal({
                    title: " ",
                    text: 'Todavía no inicia la temporada para el equipo "' + this.equipo.nombre + '"',
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                  });
               this.cargar_equipos();
               return false;
            }

            this.premio = 0;
            this.$http.post('cargar_premios_equipo?view',{equipo_id:this.equipo.id}).then(function(response){
                console.log('premios----');
                console.log(response.body);
                if( response.body.resultado ){
                    for (let index = 0; index < response.body.data.length; index++) {
                        this.premio = parseFloat(response.body.data[index].premio) +  this.premio;
                        console.log("premios")
                        console.log(response.body.data[index].premio )
                    }
                    this.premios = response.body.data;
                    console.log(this.premios);
                    this.premio = (this.premio).toFixed(2);
                    this.cargar_gastos();
                }
            });
        },
        cargar_gastos(){
            this.gasto = 0;

            this.$http.post('cargar_gastos_equipo?view',{equipo_id:this.equipo.id}).then(function(response){
                if( response.body.resultado ){
                    this.gastos = response.body.data;
                    console.log(this.gastos)
                    this.gasto=0;
                    for (let index = 0; index < response.body.data.length; index++) {
                        this.gasto = parseFloat(response.body.data[index].gasto) +  this.gasto;
                        console.log("montoooo" )
                        console.log(response.body.data[index].monto )
                    }
                    this.gasto = (this.gasto).toFixed(2);

                }
                this.saldo_disponible = (this.premio - this.gasto).toFixed(2);
            });
        },
       /*  cargar_negociaciones(){
            this.$http.post('cargar_negociaciones?view',{liga_participantes_id:this.datos_liga.liga_participantes_id, temporada_liga_id:this.datos_liga.temporada_id}).then(function(response){
                if( response.body.resultado ){
                    this.compras = response.body.compras;
                  //  console.log(this.compras);
                    this.ventas = response.body.ventas;
                    this.total_compras = response.body.total_compras;
                    this.total_ventas = response.body.total_ventas;
                    this.saldo_disponible = response.body.saldo_disponible;

                }else{
                    swal("", "Ha ocurrido un error", "error")
                }

            });
        }, */
        ver_premios(){
            this.mostrar_gastos = false;
            this.mostrar_premios = true;
        },

        ver_gastos(){
            this.mostrar_gastos = true;
            this.mostrar_premios = false;
        }


    }
  }