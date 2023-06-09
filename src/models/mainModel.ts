const path = require("path");
const fs = require("fs");

let filePath = path.resolve(__dirname, '../../src/data/players.json')
let data = JSON.parse(fs.readFileSync(filePath, 'utf8')); 

let fileMatchesPath = path.resolve(__dirname, '../../src/data/matches.json')
let matchesData = JSON.parse(fs.readFileSync(fileMatchesPath, 'utf8')); 

function save(d,path) {
    fs.writeFileSync(path, JSON.stringify(d,null,2));
    return;
}

const model = {
    findAll: () => {
        return data
    },
    findByTier: (tier) => {
        return data.filter(p => Math.ceil(p.prevData.seed / 16) == tier);
    },
    findByGroup: (group,tier) => {
        // console.log(`Grupo: ${group} tiene ${model.findAllGroups(tier)[group].length}`);
        return model.findAllGroups(tier)[group]
    },
    findByPk: (id) => {
        return data.find(d => d.id == id);
    },
    assignGroup: (playerId, group) => {
        // function validGroup(g) {
        //     return g == 1 ? g == 1 : g == 2 ? g == 2 : g == 3 ? g == 3 : g == 4 ? g == 4 : false;
        // }
        let tier = Math.ceil(model.findByPk(playerId).prevData.seed / 16)
        if (group == null ? group == null : group == 1 ? group == 1 : group == 2 ? group == 2 : group == 3 ? group == 3 : group == 4 ? group == 4 : false) {
            // console.log(model.findByGroup(group,tier));
            if (model.findByGroup(group,tier).length == 4 && group != null) { // Grupo lleno
                return 500;
            // } else if(model.findByGroup(group,tier)) {

            } else {
                data = data.map(p => {
                    if (p.id == playerId) {
                        p.group = group;
                    }
                    return p;
                })
                // model.createGroupMatches(data,tier,null);
                save(data, filePath);
                return 200;
            }
        } else {
            return 400
        }
    },
    bringGroupMatches: ()=> {
        return matchesData
    },
    saveGroupMatches: (data)=> {
        save(data, fileMatchesPath);
    },
    setWinner: (matchId, tier, winner) => {
        // console.log("j",matchId);
        let d = model.bringGroupMatches();
        let matchesAcc = []
        d[tier].map(j => {
            // matchesAcc = [...matchesAcc, ...j[0], ...j[1], ...j[2], ...j[3], ...j[4]]
            for (let i = 0; i < j.length; i++) {
                const m = j[i];
                // console.log("m",j);
                if (m[0].id == matchId) {
                    m[0].winner = winner
                }else if (m[1] && m[1].id == matchId){
                    m[1].winner = winner
                }
            }
            return j;
        });
        // console.log(d[tier][0]);
        console.log(matchesAcc);
        
        model.createGroupMatches(d,tier, matchId/* , matches */);
        return;
    },
    setMatchInfo: (matchId, tier, matchInfo) => {
        // console.log("j",matchId);
        let d = model.bringGroupMatches();
        let matchesAcc = []
        d[tier].map(j => {
            // matchesAcc = [...matchesAcc, ...j[0], ...j[1], ...j[2], ...j[3], ...j[4]]
            for (let i = 0; i < j.length; i++) {
                const m = j[i];
                // console.log("m",j);
                if (m[0].id == matchId) {
                    m[0].matchInfo = matchInfo
                }else if (m[1] && m[1].id == matchId){
                    m[1].matchInfo = matchInfo
                }
            }
            return j;
        });
        // console.log(d[tier][0]);
        console.log(matchesAcc);
        
        model.createGroupMatches(d,tier, matchId/* , matches */);
        return;
    },
    createGroupMatches: (data,tier, matchId) => {
        console.log(matchId);
        let h = data || model.bringGroupMatches();

        let groupsToModify = Object.values(model.findAllGroups(tier)).filter((g,i) => {
            return Object.keys(model.findAllGroups(tier))[i] != "null"
        });
        // console.log(groupsToModify);
        let acc = []
        groupsToModify.forEach((group,i) => {
            // console.log(h[tier][i]);
            let matches = [...h[tier][i][0],...h[tier][i][1],...h[tier][i][2]]
            let g = []

            let baseId = (i*tier*5)
            // console.log(group);
            let fechaUno = [];
            fechaUno.push({
                id: baseId+1,
                playerOne: group[0] || "TBD",
                playerTwo: group[2] || "TBD",
                info: {
                    schedule: "TBD",
                    draft: "TBD"
                },
                winner: matches.find((r) => r.id == (baseId+1)).winner
            });
            fechaUno.push({
                id: baseId+2,
                playerOne: group[1] || "TBD",
                playerTwo: group[3] || "TBD",
                info: {
                    schedule: "TBD",
                    draft: "TBD"
                },
                winner: matches.find((r) => r.id == (baseId+2)).winner
            });
            g.push(fechaUno);

            let fechaDos = [];
            fechaDos.push({
                id: baseId+3,
                playerOne: fechaUno[0].winner == 0 && fechaUno[0].winner != null ? fechaUno[0].playerOne : fechaUno[0].winner != null ? fechaUno[0].playerTwo : undefined || "TBD",
                playerTwo: fechaUno[1].winner == 0 && fechaUno[1].winner != null ? fechaUno[1].playerOne : fechaUno[1].winner != null ? fechaUno[1].playerTwo : undefined || "TBD",
                info: {
                    schedule: "TBD",
                    draft: "TBD"
                },
                winner: (matchId == baseId + 1 || matchId == baseId + 2) ? null : matches.find((r) => r.id == (baseId+3)).winner
            })
            fechaDos.push({
                id: baseId+4,
                playerOne: fechaUno[0].winner == 0 && fechaUno[0].winner != null ? fechaUno[0].playerTwo : fechaUno[0].winner != null ? fechaUno[0].playerOne : undefined || "TBD",
                playerTwo: fechaUno[1].winner == 0 && fechaUno[1].winner != null ? fechaUno[1].playerTwo : fechaUno[1].winner != null ? fechaUno[1].playerOne : undefined || "TBD",
                info: {
                    schedule: "TBD",
                    draft: "TBD"
                },
                winner: (matchId == baseId + 1 || matchId == baseId + 2) ? null : matches.find((r) => r.id == (baseId+4)).winner
            })
            g.push(fechaDos)

            let fechaTres = [];
            fechaTres.push({
                id: baseId+5,
                playerOne: (matchId == baseId + 1 || matchId == baseId + 2) ? "TBD" : fechaDos[0].winner == 0 && fechaUno[0].winner != null ? fechaDos[0].playerTwo : fechaUno[0].winner != null ? fechaDos[0].playerOne : undefined || "TBD",
                playerTwo: (matchId == baseId + 1 || matchId == baseId + 2) ? "TBD" : fechaDos[1].winner == 0 && fechaUno[1].winner != null ? fechaDos[1].playerOne : fechaUno[1].winner != null ? fechaDos[1].playerTwo : undefined || "TBD",
                info: {
                    schedule: "TBD",
                    draft: "TBD"
                },
                winner: (matchId == baseId + 1 || matchId == baseId + 2 || matchId == baseId + 3 || matchId == baseId + 4) ? null : matches.find((r) => r.id == (baseId+5)).winner
            })
            g.push(fechaTres)

            acc.push(g);
        })
        h[tier] = acc;
        // console.log(h[tier]);
        model.saveGroupMatches(h);
        return acc;
    },
    findAllGroups: function(tier) {
        let data = model.findByTier(tier);
        // console.log(data);
        let result = {
            '1': data.filter(r => r.group == 1) || [],
            '2': data.filter(r => r.group == 2) || [],
            '3': data.filter(r => r.group == 3) || [],
            '4': data.filter(r => r.group == 4) || [],
            'null': data.filter(r => r.group == null) || [],
        }
        // console.log(result);
        return result;
    }
};

export { model };
