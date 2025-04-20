const NUM_REQUESTS =10;
const URL = 'http://127.0.0.1:8080/test';

(async () => {
  const start = Date.now();

  let completed = 0;
  let successCount = 0;
  let failureCount = 0;

  // Create an array of promises for all requests
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

    // Push each promise to the array
    requests.push(request);
  }

  // Wait for all requests to complete
  await Promise.all(requests);

  // After all requests are complete, log the final statistics
  const totalTime = Date.now() - start;
  const successRate = ((successCount / NUM_REQUESTS) * 100).toFixed(2);
  console.log(`\nTotal time taken: ${totalTime}ms`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📊 Success Rate: ${successRate}%`);
})();
