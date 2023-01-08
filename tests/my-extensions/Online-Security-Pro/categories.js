function Categories(URL) {

    var urlCategories;
    var rawUrlCategories = {
        version:3,
        categories:[
            {id:7, uuid:"{B45DF331-D64A-41EF-858E-95B201488CEA}", names:[{langid:1033, name:"PUA"}]},
            {id:6, uuid:"{232B0EE9-DFCD-4103-BE3F-5A3367DAEF66}", names:[{langid:1033, name:"Malicious"}]},
            {id:5, uuid:"{1C51900E-98BD-44ED-86C5-7DDF6503F553}", names:[{langid:1033, name:"Malware"}]},
            {id:4, uuid:"{C4810420-D9E3-48B3-B708-AAD3320A1108}", names:[{langid:1033, name:"Phishing"}]},
            {id:3, uuid:"{14A06517-DA45-49BE-82CA-F6F38467C454}", names:[{langid:1033, name:"Suspicious"}]},
            {id:2, uuid:"{755721D3-CB48-497A-9617-D0DC167C0492}", names:[{langid:1033, name:"Safe"}]},
            {id:1, uuid:"{00000000-0000-0000-0000-000000000000}", names:[{langid:1033, name:"Not found"}]}
        ]
    };

    simplifyCategories(rawUrlCategories.categories);

    function simplifyCategories(data) {
        urlCategories = [];

        for (var item, i = 0; i < data.length; i ++){
            item = data[i];
            urlCategories[item.id] = {
                id: item.id,
                name: item.names[0].name
            }
        }
    }

    function getNameByid(id) {
        return urlCategories[id].name;
    }


    return {
        getNameByid: getNameByid
    }
}

