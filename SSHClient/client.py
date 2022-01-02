import socket
import json

SERVER_HOST = "localhost"
SERVER_PORT = 12346


def connect_to_ssh_server(client_socket, params: dict):
    client_msg = json.dumps({"op": "10", "d": params})
    client_socket.sendall(client_msg.encode())
    return True  # Todo: Implement recv


def get_connect_params() -> dict:
    chosen_account_id = input("id: ")
    chosen_IP = input("IP: ")
    chosen_port = input("Port: ")
    chosen_username = input("Username: ")
    chosen_password = input("Password: ")
    params_dict = {"accountId": chosen_account_id, "serverIP": chosen_IP, "serverPort": chosen_port, "accountName": chosen_username, "accountPassword": chosen_password}
    return params_dict


def send_command(client_socket, command: str, connect_params: dict):
    command_dict = connect_params.copy()
    command_dict["command"] = command
    client_msg = json.dumps({"op": "20", "d": command_dict})
    client_socket.sendall(client_msg.encode())
    return True  # Todo: Implement recv


def main():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((SERVER_HOST, SERVER_PORT))
    # Connect to ssh server
    connect_dict = get_connect_params()
    if connect_to_ssh_server(client_socket, connect_dict):
        command = ""
        while command != "exit":
            print("")
            command = input(connect_dict["accountName"] + ">")

            print(connect_dict)
            send_command(client_socket, command, connect_dict)
            print(connect_dict)


if __name__ == '__main__':
    main()
