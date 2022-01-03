import socket
import paramiko
import json

from protocol import Responder, Codes

SERVER_PORT = 12346
SERVER_HOST = "127.0.0.1"
# ops = dict(
#     CONNECT=10,  # (accountId --> serverIP, serverPort, accountName, accountPassword)
#     SEND_COMMAND=20,  # (accountId --> serverIP, serverPort, accountName, accountPassword)
# )

SSH_CLIENTS = dict()


def send_message(client_socket: socket.socket, code: str, data: dict):
    client_socket.sendall(json.dumps({"type": code, "d": data}).encode())


def get_command_params(d: dict):
    account_id = d["accountId"]
    command = d["command"]
    sender = d["sender"]
    return account_id, sender, command


def send_command_to_ssh_server(msg_dict: dict, server_responder: Responder):
    print("Sending command...")
    d = msg_dict["d"]
    try:
        account_id, sender, command = get_command_params(d)
    except KeyError:
        # server_responder.send_command_fail("Missing params...")  # Todo: Think more about id
        print("Missing params....")
        return
    if not account_id or not command:
        # server_responder.send_command_fail("Missing params...")
        print("Missing params....")
        return
    elif account_id not in SSH_CLIENTS.keys():
        server_responder.send_command_fail(account_id, sender, command, "account id was not found...")
        print("account id was not found...")
        return
    print("Sending command! :)")
    ssh = SSH_CLIENTS[account_id]
    try:
        ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command(command)
    except paramiko.ssh_exception.SSHException as e:
        print(str(e))
        server_responder.send_command_fail(account_id, sender, command, str(e))
        return
    # print(ssh_stdin)
    print(ssh_stdout.read().decode())
    server_responder.send_command_success(account_id, sender, command, ssh_stdout.read().decode())
    # print(ssh_stderr)


def main():
    listening_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listening_socket.bind((SERVER_HOST, SERVER_PORT))
    listening_socket.listen()
    print("listening on port " + str(SERVER_PORT))
    has_client_closed_connection = False
    while True:
        client_socket, client_address = listening_socket.accept()
        with client_socket:
            server_responder = Responder(client_socket)
            print(f"{client_address=}")
            while not has_client_closed_connection:
                try:
                    client_msg = client_socket.recv(1024)
                except ConnectionResetError:
                    print("Connection lost... bye bye")
                    has_client_closed_connection = True
                print(client_msg)
                try:
                    msg_dict = json.loads(client_msg.decode())
                except json.decoder.JSONDecodeError:
                    print("Unable to decode json...")
                    continue
                print(msg_dict)
                command_type = msg_dict["type"]
                if Codes.Requests.is_connect(command_type):
                    connect_to_ssh_server(msg_dict, server_responder)
                elif Codes.Requests.is_send_command(command_type):
                    send_command_to_ssh_server(msg_dict, server_responder)
        has_client_closed_connection = False


def connect_to_ssh_server(msg_dict: dict, server_responder: Responder):
    print("Connecting...")
    d = msg_dict["d"]
    try:
        account_id, server_ip, server_port, account_username, account_password = get_connect_params(d)
    except KeyError:
        server_responder.connect_fail("Missing params....")
        print("Missing params....")
        return
    try:
        port = int(server_port)
    except ValueError:
        server_responder.connect_fail("Port is not a number...")
        print("Port is not a number...")
        return
    if account_id in SSH_CLIENTS.keys():
        print("Already connected to the ssh server...")
        server_responder.connect_success(account_id, "Already connected to the ssh server...")
    else:  # If all the params are valid, try to connect
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(server_ip, port=port, username=account_username, password=account_password)
        except paramiko.ssh_exception.NoValidConnectionsError:
            server_responder.connect_fail("Network error connecting to server...")
            print("Network error connecting to server...")
            return
        except paramiko.ssh_exception.SSHException as e:
            server_responder.connect_fail("SSH Exception has occurred..." + str(e))
            print("SSH Exception has occurred..." + str(e))
            return
        except TimeoutError as e:
            server_responder.connect_fail("SSH Exception has occurred..." + str(e))
            print("SSH Exception has occurred..." + str(e))
            return
        print("Connected successfully! :)")
        SSH_CLIENTS[account_id] = ssh
        server_responder.connect_success(account_id)


def get_connect_params(d: dict):
    account_id = d["accountId"]
    server_ip = d["serverIP"]
    server_port = d["serverPort"]
    account_username = d["accountName"]
    account_password = d["accountPassword"]
    return account_id, server_ip, server_port, account_username, account_password


if __name__ == '__main__':
    main()
