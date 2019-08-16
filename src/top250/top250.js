var Top250 = {
    startNum  : 0,
    count :  10,
    isloading : false,
    isfinished  : false,
    init: function(){
      var me = this
      this.$contain = $('#top250'),
      this.$container = this.$contain.find('.container')
      this.bind()
      this.getData(me.renderData)
    },
    bind: function(){
      var me = this
      this.$contain.on('scroll',function(){
        if(me.clock) {
          clearTimeout(me.clock)
        }
        me.clock = setTimeout(function(){
          //console.log('scroll')
          if(me.isToBottom() && !me.isfinished){
            //console.log('bottom')
            me.getData(function(data){
              me.renderData(data)
              if(me.startNum * me.count >= data.total){
                me.isfinished = true
                me.$contain.find('.nomore').show()
              }
            })
          }
        },100)
      })
    },
    getData: function(callback){
      var me = this
      if(me.isloading) return
      me.isloading = true
      $('.loading').show()
      $.ajax({
        type: 'GET',
        url: 'https://api.douban.com/v2/movie/top250',
        data: {
          start: me.startNum * me.count,
          count: me.count,
        },
        dataType: 'jsonp'
      }).done(function(res){
        //console.log(res)
        callback(res)
        me.startNum++
        //console.log('startNum ---'+ me.startNum)
      }).always(function(){
        //console.log('done')
        $('.loading').hide()
        me.isloading = false
      })
    },
    isToBottom : function(){
      return  this.$contain.height() + this.$contain.scrollTop() +30  >= this.$container.height()
    },
    renderData: function(data){
      var me = this
      //console.log(data)
      data.subjects.forEach(function(movie){
        //console.log(movie)
        var tpl = `<div class="item">
            <a href="#">
              <div class="cover">
                <img src="https://img7.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg" alt="">
              </div>
              <div class="detail">
                <h2>霸王别姬</h2>
                <div class="extra"><span class="score"></span><span>分</span> / <span class="collect">1000</span><span>收藏</span></div>
                <div class="extra"><span class="year"></span> / <span class="genres"></span></div>
                <div class="extra">导演:<span class="director"></span></div>
                <div class="extra">主演: <span class="casts"></span></div>
              </div>
            </a>
          </div>`
        var $node = $(tpl)
        $node.find('.cover img').attr('src',movie.images.medium)
        $node.find('.itme>a').attr('href',movie.alt)
        $node.find('.detail>h2').text(movie.title)
        $node.find('.score').text(movie.rating.average)
        $node.find('.collect').text(movie.collect_count)
        $node.find('.director').text(movie.directors.map(v=>v.name).join('/'))
        $node.find('.casts').text(movie.casts.map(v=>v.name).join('、'))
        $node.find('.year').text(movie.year)
        $node.find('.genres').text(movie.genres.join('、'))
        //console.log(movie.genres)
        $('#top250 .container').append($node)
      })
    },
}

module.exports = Top250
