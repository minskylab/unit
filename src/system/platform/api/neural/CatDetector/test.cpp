#include<iostream>
using namespace std;

int tempfun() {

    return 24;
}

int funtemp() {
    return 36;
}

extern "C" int main(int argc, char** argv){

    return funtemp();
}