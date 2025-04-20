const NUM_REQUESTS = process.argv[2] || 10;
const URL = 'http://127.0.0.1:8080/test';

(async () => {
  const start = Date.now();

  let completed = 0;
  let successCount = 0;
  let failureCount = 0;

  const requests = [];

  for (let i = 0; i < NUM_REQUESTS; i++) {
    const request = fetch(URL)
      .then(async res => {
        const body = await res.text();
        completed++;

        if (res.status !== 200 || body.includes("No available servers")) {
          failureCount++;
          console.error(`❌ Response ${completed}:`, body);
        } else {
          successCount++;
          console.log(`✅ Response ${completed}:`, body);
        }
      })
      .catch(err => {
        completed++;
        failureCount++;
        console.error(`❌ Request ${completed} failed:`, err.message);
      });

    
    requests.push(request);
  }

  
  await Promise.all(requests);

  const totalTime = Date.now() - start;
  const successRate = ((successCount / NUM_REQUESTS) * 100).toFixed(2);
  console.log(`\nTotal time taken: ${totalTime}ms`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📊 Success Rate: ${successRate}%`);
})();
