Vue.component('rowsmodulos',{
  
  data:()=>({
    rowsmodulos:'',
  }),
  created:()=>{
   // console.log(this.rowsmodulos_det);
  },
  mounted:function(){
    this.listar_menu();
  },
  methods:{
    listar_menu(){
      console.log("menu-rincipal-portada-index");
      axios.get('list_modulos?view').then(function(response){
        
          console.log(response.data)
          this.rowsmodulos=response.data;
      });
  },
  },
  template:`<div>
  <div v-html="rowsmodulos">
  {{rowsmodulos}}
      </div> 
  </div>`,
}) 