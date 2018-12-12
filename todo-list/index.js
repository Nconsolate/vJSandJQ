new Vue({
    el: '#app',
    data: {
        todos: [
            {
                id: 1,
                text: '吃饭',
                flag: true
            },
            {
                id: 2,
                text: '睡觉',
                flag: true
            },
            {
                id: 3,
                text: '打豆豆',
                flag: true
            }
        ],
        bottomBtns: [
            {
              id: 1,
              title: 'A',
              theme: 'success',
              type: 'all'
            },
            {
                id: 2,
                title: 'F',
                theme: 'primary',
                type: 'finished'
            },
           {
              id: 3,
              title: 'U',
              theme: 'danger',
              type: 'unfinished'
           },
        ],
        isMaskShow: false,

        idSave: null,
        currentType: 'finished',
        addflag:false,
        focusflag:false,
        addtext:""
    },
    methods :{
        check(id,flag){
            if( !flag ){
                this.isMaskShow = true;
                this.idSave = id ;
                return false;
            }
            this.removeTodo( id )
        },
        removeTodo( id ){
           this.todos = this.todos.filter((item) => {
               return item.id !== id ? item : false
           })
        },
        addTodo(){
            var maxid = this.todos[this.todos.length-1].id+1;
            this.todos.push({
                id: maxid,
                text: this.addtext,
                flag: true
            });
            this.addtext="";
            this.addflag=false;
        },
        // clearBottomBtnZ(){
        //     var btnHeight = document.querySelector(".bottom-btn-boxs").offsetHeight;

        // }
    },
    computed: {
        finishedTodos(){
            return this.todos.filter((item) => {
                return item.flag?item:false
            })
        },
        unfinishedTodos(){
            return this.todos.filter((item) => {
                return !item.flag?item:false
            })
        },
        newTodos(){
            switch (this.currentType){
                case "all": return this.todos;
                case "finished": return this.finishedTodos;
                default: return this.unfinishedTodos;
              }
            }
        },
    mounted() {
        this.$refs.content.style.marginBottom=this.$refs.bottom.offsetHeight+"px";
    }
    })
