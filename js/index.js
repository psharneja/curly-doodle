const in_folder ='../data/';
const fs = require('fs');
var file_names = ['India2011.csv','IndiaSC2011.csv','IndiaST2011.csv'];

//for reading file names from pre defined directory
/*fs.readdir(in_folder, (err, files) => {
    files.forEach(function(i){
                      tasks(in_folder + i);

                    console.log(i);
        
                  });
})*/


var headers = []; //title details


//objects for json
var Oage_wise = {};
var Ograduates = {};
var Oeducation = {};



file_names.forEach(function(i){
 //calling tasks function
    tasks(in_folder + i);
});

//conver 'object of objects' into 'array of objects' and calling file write function
write_age_wise_data();
write_graduate_data();
write_education_category_data();


function tasks(file){
    
    var age_det;
    var state_det;
    var edu_det;
    
    fs.readFileSync(file).toString().split('\n').forEach(function (line_value, index_value) {
    var row=line_value.split(','); //dividing row in cells and getting array of cells
        if(index_value === 0){
            headers = row;//saving first header row
        }
    
        if(index_value !== 0 && line_value !== ''){
            
            if( row[4] === 'Total' && row[5]=== 'All ages'){
                 // all graduates data
                var state = row[3];
                var g_all = parseInt(row[39]);
                var g_males = parseInt(row[40]);
                var g_females = parseInt(row[41]);
                            
                if(row[3] in Ograduates){
                    
                    state_det = row[3];
                    Ograduates[state_det].state_name = row[3].replace(/State - /g, '');
                    Ograduates[state_det].grad_all = Ograduates[state_det].grad_all + g_all;
                    Ograduates[state_det].grad_males = Ograduates[state_det].grad_males + g_males;
                    Ograduates[state_det].grad_females = Ograduates[state_det].grad_females + g_females;
                }else {
                    state_det = row[3];
                    Ograduates[state_det] = {
                        state_name: row[3].replace(/State - /g, ''),
                        grad_all: g_all,
                        grad_males: g_males,
                        grad_females: g_females
                    };

                }
            }
             //////////////////////////////////////////////////////////////   
            if( row[4] === 'Total' && row[5] !== 'All ages'){
                //age wise data distribution
                var literate_population = parseInt(row[12]);
                var literate_males = parseInt(row[13]);
                var literate_females = parseInt(row[14]);
                
                if(row[5] in Oage_wise){
                    age_det = row[5];
                    Oage_wise[age_det]._age = row[5];
                    Oage_wise[age_det]._all = Oage_wise[age_det]._all + literate_population;
                    Oage_wise[age_det]._males = Oage_wise[age_det]._males + literate_males;
                    Oage_wise[age_det]._females = Oage_wise[age_det]._females + literate_females;
                }else {
                    age_det = row[5];
                    Oage_wise[age_det] = {
                        _age: row[5],
                        _all: literate_population,
                        _males: literate_males,
                        _females: literate_females
                    };

                }
                
               
                //Education level of all categories
                for(var indexes = 15; indexes <43; indexes = indexes + 3 ){

                    var parts = headers[indexes].trim().match(/^Educational level\s+-\s+(.*[^\\*])\s+-\s+\w*$/i);
                    var headingname = parts[1];
                    if( headingname in Oeducation ){
                        Oeducation[headingname].total = Oeducation[headingname].total+parseInt(row[indexes]);
                    } else {
                        Oeducation[headingname] = {
                            education_level: headingname,
                            total: parseInt(row[indexes])
                        };
                    }
                    
                }
                
            }
            
        }
        
        
        
        
        
    })

}

// writing objects as json files
function write_age_wise_data(){
    //arrays to remove name of documents in json and convert output 'object of objects' to 'array of objects'
    var Aage_wise = [];
    ////var Agraduates = [];
    var Aeducation = [];
    
    var key = [];
    
    key = Object.keys(Oage_wise);
    for( var i = 0, len=key.length; i < len; i++){
         Aage_wise[i] ={ _age: Oage_wise[key[i]]._age,  _all: Oage_wise[key[i]]._all, _males: Oage_wise[key[i]]._males, _females: Oage_wise[key[i]]._females };
    }
    
    

    //writing to file
    fs.writeFileSync('../output_files/age_wise_data.json', JSON.stringify(Aage_wise));
   

   
}

function write_graduate_data(){
    var Agraduates = [];
    var key = [];
    
    key = Object.keys(Ograduates);
    
    for( var i = 0, len=key.length; i < len; i++){
         Agraduates[i] ={ _state_name: Ograduates[key[i]].state_name,  _grad_all: Ograduates[key[i]].grad_all, _grad_males: Ograduates[key[i]].grad_males, _grad_females: Ograduates[key[i]].grad_females };
    }
    
    
    //writing to file
    fs.writeFileSync('../output_files/graduates_data.json', JSON.stringify(Agraduates));
}

function write_education_category_data(){
    var Aeducation = [];
    var key = [];
    
    key = Object.keys(Oeducation);
    
    for( var i = 0, len=key.length; i < len; i++){
         Aeducation[i] ={ _education_level: Oeducation[key[i]].education_level,  _all: Oeducation[key[i]].total};
    }
    
    
    //writing to file
    fs.writeFileSync('../output_files/literate.json', JSON.stringify(Aeducation));
}




