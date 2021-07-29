import os
import shutil

from jinja2 import Environment, FileSystemLoader

default_values = {
    "support_invite": "https://discord.gg/xFZu29t",
    "docs": "https://docs.messagemanager.xyz",
    "invite": "https://discord.com/api/oauth2/authorize?client_id=735395698278924359&permissions=537250880&scope=bot%20applications.commands",
    "privacy": "https://github.com/message-manager-discord/bot/blob/master/PRIVACY_POLICY.md",
    "source": "https://github.com/message-manager-discord/site",
}

env = Environment(loader=FileSystemLoader("templates"))

url_for_index = "/"
url_for_invite = "/invite"
url_for_privacy = "/privacy"

index_template = env.get_template("index.html")
index_output = index_template.render(
    name="Home - ",
    default_values=default_values,
    url_for_index=url_for_index,
    url_for_invite=url_for_invite,
    url_for_privacy=url_for_privacy,
)

location = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(location, "build")

try:
    shutil.rmtree(path)
except FileNotFoundError:
    pass

shutil.copytree(
    os.path.join(location, "static"), os.path.join(location, "build/static")
)


with open("build/index.html", "w+") as index_file:
    index_file.write(index_output)

template_404 = env.get_template("error.html")
output_404 = template_404.render(
    default_values=default_values,
    name="404 - ",
    error_code=404,
    message="That page was not found on this site!",
    url_for_index=url_for_index,
    url_for_invite=url_for_invite,
    url_for_privacy=url_for_privacy,
)

with open("./build/404.html", "w+") as file_404:
    file_404.write(output_404)

template_redirects = env.get_template("_redirects")
output_redirects = template_redirects.render(default_values=default_values)

with open("./build/_redirects", "w+") as file_redirects:
    file_redirects.write(output_redirects)

print("Finished generating files!")
