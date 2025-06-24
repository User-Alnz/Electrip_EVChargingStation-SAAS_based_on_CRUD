function setDataInCache(key: string, value: number, expiryTime: number) : void
{
    const item = { value, expiry: expiryTime };
    localStorage.setItem(key, JSON.stringify(item));
}

function getDataInCache(key: string) : number | null 
{
    const itemOject = localStorage.getItem(key); // ex => {"value":0.28,"expiry":1750153632000}
    if (!itemOject) return null;
  
    const item = JSON.parse(itemOject);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
  
    return item.value;
}

export {setDataInCache, getDataInCache};