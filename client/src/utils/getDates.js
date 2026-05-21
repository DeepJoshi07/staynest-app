export const getDatesBetween = (from, till) => {
  const dates = [];
  let current = new Date(from);
  const end = new Date(till);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates.map((d)=>{
    const year = d.getFullYear();
    const month = String(d.getMonth()+1).padStart(2,0);
    const day = String(d.getDate()).padStart(2,"0");
    return `${year}/${month}/${day}`;
  })
};