import socket
import sys

def test_port(host, port):
    print(f"Testing {host}:{port}...")
    try:
        sock = socket.create_connection((host, port), timeout=10)
        sock.close()
        print(f"  [SUCCESS] Port {port} is OPEN.")
        return True
    except socket.timeout:
        print(f"  [TIMEOUT] Port {port} is BLOCKED (no response).")
    except Exception as e:
        print(f"  [ERROR] Port {port} failed: {e}")
    return False

if __name__ == "__main__":
    targets = [
        ("smtp.gmail.com", 587),
        ("smtp.gmail.com", 465),
        ("smtp.gmail.com", 25),
        ("8.8.8.8", 53), # DNS test
        ("google.com", 80), # HTTP test
    ]
    
    print("--- RENDER NETWORK DIAGNOSTIC ---")
    for host, port in targets:
        test_port(host, port)
    print("---------------------------------")
