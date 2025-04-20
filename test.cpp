#include <iostream>
#include <cstdlib>
#include <thread>
#include <chrono>

int main() {
    std::cout << "🚀 Starting Load Balancer..." << std::endl;
    system("cmd.exe /c start cmd.exe /k \"node load_balancer.js\"");

    std::this_thread::sleep_for(std::chrono::seconds(2));

    std::cout << "🛠️  Starting 3 Servers and logging output..." << std::endl;
    system("cmd.exe /c start cmd.exe /k \"node multiple_server.js 3 \"");

    std::this_thread::sleep_for(std::chrono::seconds(3));

    std::cout << "🧪 Running Test Script..." << std::endl;
    system("cmd.exe /c start cmd.exe /k \"node test.js\"");

    std::cout << "✅ All processes launched.\nCheck 'server_log.txt' for server output." << std::endl;
    return 0;
}
