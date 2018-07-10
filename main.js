var app = new Vue({
    el: '#root',
    data: {
        LocationDistrict: [
            '全部行政區',
            '中正區',
            '大同區',
            '松山區',
            '中山區',
            '大安區',
            '萬華區',
            '信義區',
            '士林區',
            '北投區',
            '內湖區',
            '南港區',
            '文山區'
        ],
        info: [],
        pageIndex: 0,
        selectDistrict: '全部行政區'
    },
    mounted: function () {
        this.getJson();
        setInterval(this.getJson, 1800000)
    },
    methods: {
        getJson: function () {
            axios.get('https://tpeoc.blob.core.windows.net/blobfs/GetDisasterSummary.json')
                .then(function (response) {
                    app.info = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        paginationNext: function () {
            if ( this.pageIndex == this.filterInfo.length - 1) {
                this.pageIndex = this.filterInfo.length - 1;    
            } else {
                this.pageIndex++
            }
        },
        paginationPre: function () {
            if ( this.pageIndex == 0) {
                this.pageIndex = 0;    
            } else {
                this.pageIndex--
            }
        }
    },
    computed: {
        // 行政區篩選
        sortInfo: function () {
            const vm = this;
            let item = [];
            const dataArray = this.info.map(function (obj) {
                return {
                    CaseTime: obj.CaseTime.split('T')[0] + ' ' + obj.CaseTime.split('T')[1],
                    CaseLocationDistrict: obj.CaseLocationDistrict,
                    CaseLocationDescription: obj.CaseLocationDescription,
                    CaseDescription: obj.CaseDescription,
                    CaseComplete: obj.CaseComplete
                }
            })
            if (this.selectDistrict === '全部行政區') {
                item = dataArray
            } else {
                dataArray.forEach(function (e) {
                    if (e.CaseLocationDistrict === vm.selectDistrict) {
                        item.push(e);
                    }
                })
            }
            return item

        },
        // 分頁
        filterInfo: function () {
            const vm = this;
            const newData = [];
            this.sortInfo.forEach(function (item, i) {
                if (i % 10 == 0) {
                    newData.push([])
                }
                const page = parseInt(i / 10);
                newData[page].push(item)
            })
            return newData
        }
    }
})