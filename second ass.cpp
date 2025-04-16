#include <iostream>
#include <limits.h> 
using namespace std;

int main() {
    int n;
    
    cout << "Enter the number of elements: ";
    cin >> n;
    if (n < 3) {
        cout << "Please enter at least 3 numbers." << endl;
        return 0;
    }

    int arr[n];

    cout << "Enter " << n << " numbers:\n";
    for (int i = 0; i < n; ++i) {
        cin >> arr[i];
    }
    int first = INT_MIN, second = INT_MIN, third = INT_MIN;

    for (int i = 0; i < n; ++i) {
        int num = arr[i];

        if (num > first) {
           
            third = second;
            second = first;
            first = num;
        } else if (num > second && num != first) {
            third = second;
            second = num;
        } else if (num > third && num != second && num != first) {
            third = num;
        }
    }

    cout << "Largest: " << first << endl;
    cout << "Second Largest: " << second << endl;
    cout << "Third Largest: " << third << endl;

    return 0;
}
