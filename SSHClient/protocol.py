import socket
import json

import yaml

commands = None
with open("commands.yaml", 'r') as stream:
    try:
        commands = yaml.safe_load(stream)
    except yaml.YAMLError as exc:
        print(exc)

if commands is None:
    print("(protocol.py) WARNING! Unable to parse commands.yaml...")
    print("(protocol.py) Using default values")


# # Requests
# SSH_CONNECT_REQUEST = "sshConnectReq" if commands is None else commands["request"]["connect"]
# SSH_SEND_COMMAND_REQUEST = "sshSendCommand" if commands is None else commands["request"]["sendCommand"]
#
# # Responses
# ## Connect
# SSH_CONNECT_SUCCESS_RESPONSE = "sshConnectSuccess" if commands is None else commands["response"]["connect"]["success"]
# SSH_CONNECT_FAIL_RESPONSE = "sshConnectFail" if commands is None else commands["response"]["connect"]["fail"]
# ## Send Message
# SSH_SEND_COMMAND_SUCCESS_RESPONSE = "sendCommandSuccess" if commands is None else commands["response"]["sendCommand"][
#     "success"]
# SSH_SEND_COMMAND_FAIL_RESPONSE = "sendCommandFail" if commands is None else commands["response"]["sendCommand"]["fail"]


class Codes:
    class Requests:
        CONNECT = "sshConnectReq" if commands is None else commands["request"]["connect"]
        SEND_COMMAND = "sshSendCommand" if commands is None else commands["request"]["sendCommand"]

        @staticmethod
        def is_connect(command_type: str) -> bool:
            return command_type == Codes.Requests.CONNECT

        @staticmethod
        def is_send_command(command_type: str) -> bool:
            return command_type == Codes.Requests.SEND_COMMAND

    class Responses:
        ## Connect
        CONNECT_SUCCESS = "sshConnectSuccess" if commands is None else commands["response"]["connect"]["success"]
        CONNECT_FAIL = "sshConnectFail" if commands is None else commands["response"]["connect"]["fail"]
        ## Send Message
        SEND_COMMAND_SUCCESS = "sendCommandSuccess" if commands is None else commands["response"]["sendCommand"][
            "success"]
        SEND_COMMAND_FAIL = "sendCommandFail" if commands is None else commands["response"]["sendCommand"]["fail"]


class Responder:
    def __init__(self, client_socket: socket.socket):
        self.client_socket = client_socket

    def send_message(self, code: str, data: dict):
        self.client_socket.sendall(json.dumps({"type": code, "d": data}).encode())

    def send_command_fail(self, account_id: str, sender: str, command: str, message: str):
        self.send_message(Codes.Responses.SEND_COMMAND_FAIL,
                          {"message": message, "accountId": account_id, "sender": sender, "command": command})

    def send_command_success(self, account_id: str, sender: str, command: str, message: str):
        self.send_message(Codes.Responses.SEND_COMMAND_SUCCESS,
                          {"message": message, "accountId": account_id, "sender": sender, "command": command})

    def connect_fail(self, message: str = "unable to connect to server"):
        self.send_message(Codes.Responses.CONNECT_FAIL, {"message": message})

    def connect_success(self, message: str = "successfully connected to the server"):
        self.send_message(Codes.Responses.CONNECT_SUCCESS, {"message": message})
