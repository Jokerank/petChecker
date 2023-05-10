import axios from "axios"
import { getCSV } from './csvimport.js'
import colors from "colors"

let wallets = await getCSV("wallets")
let pubAddr = wallets.map(a => a.public_address) 

function get(url) {
    const data = axios({
        method: 'get',
        url: url,
    })
    .then(function (response) {
        return response.data
    })
    return data
}

await pubAddr.forEach(async function(addr, index) {
    let reward = await get(`https://api.hellopets.world/api/v1/activity/reward?address=${addr}&activityId=0`)
    let alreadyRedemeed = reward.data.activityClaimed.status
    let rewardIS = reward.data.totalReward

    switch (alreadyRedemeed) {
        case 'SUCCESS':
            alreadyRedemeed = "Redeemed".red
            break;
        case 'DEFAULT':
            alreadyRedemeed = "Not Redeemed!".green
            break;
        default:
            alreadyRedemeed = "Unknown!".red
            break;
    }
    if (rewardIS > 0) {
        console.log(`Address: ${addr} $PET reward: ${rewardIS} Status: ${alreadyRedemeed}`)
    }
})