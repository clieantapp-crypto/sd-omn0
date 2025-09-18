import { addData } from "@/lib/firebase";
import { setupOnlineStatus } from "@/lib/utils";
import { useEffect } from "react"
function randstr(prefix: string) {
    return Math.random()
      .toString(36)
      .replace("0.", prefix || "");
  }
  const visitorID = randstr("omn-");

export const Init=()=>{
    async function getLocation() {
        const APIKEY = "856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef";
        const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;
    
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const country = await response.text();
          addData({
            id: visitorID,
            country: country,
            createdDate: new Date().toISOString(),
          });
          localStorage.setItem("country", country);
          setupOnlineStatus(visitorID);
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
    useEffect(()=>{
getLocation().then(()=>{
    console.log('init done')
})
    },[])
    return<></>
}