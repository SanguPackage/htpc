#!/bin/sh

# Script copied from "Device Manager from webOS"
# > Info > Dev Mode > Renew Automatically...

# TODO: Replace YOUR-TV-IP-HERE with well... your TV IP :)

cat > /tmp/webos_privkey_tv << END_OF_PRIVKEY
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA3nqLb5/0eERoHUkswctFRkrnb+3vV2AyqqnjQ3g3yTpoY8iK
JQfvm1aMkGcNJegxR8s4ChGLCHosrYJzuxVbHkzc9wye+y6kiR11CtnCabzijXS/
WiB4yfw2i+kY5vsW23gKiMbbzLjJzXcGz6Gwt/y7OSEWrWL6Ivqd+Y5oMDziIpI1
9qWO46e5RnovfR+eMPj/IlyRO5anoLrDblpFCzdOgNueBXw3X5VUGW7MNjqV0EvU
UyXJmxNfVXKfTW1+m4n+QmQs4MW4CSTSbQq8qtOWRu3QjLYdu4r0dKj47GB4y/Q1
aU4F9vX2IzKG9BK2RkfleFmXYGADOrBC8o5qbwIDAQABAoIBABHaTZQghtKb0qr+
8zt930o7uoSt2DXvv0EYrub8H6XjLPtM3WEJWP3jHRZ9Xn27OzEiqpWMQNbmTu2B
eV364bv1uQmOFrfbT1K9bWX4gXRQtvFY+/30exziQ1JI2zm1zmjAIkBFjN/JuE/n
jEFfHTo2aqOz9wjk12O1LrYW6l9sbPFSHIVwXmp8VZ/twXKATQKby5x60xizoA8q
yBklDACi+g784jnoMu8VPTfFo5DgscMg/SItc+HMwUghZYrhKL+aQzQnUbEswPUy
mHWeGHsF4aKJTl46aMh+Hn7kyHJYb8vwFqjNfMMQ4bqAaLbNyu9Cewwgo5b7Lu2F
6dLojrkCgYEA+/8ShJd3YhKrNaAkPGnjOse8+0ZanDoHOJHJjGgF4H/vLTKn8A0e
ex2NkFpr8xd3JW90jjttkgkm5/t6eANgWCF0fH1/EMBWkBUG9HMBgCuh1YPNO3b8
bBA+fIonSYKAbG4J2snnmLc6Oe05pdtWCEnpb2x8hpG6szzZEU0QeNMCgYEA4gNq
xND+9spUX51ouJmNUNH/+9zc1gVe6bz5uINUMNzqojUvF+eZnhy79Sd7aIByy9qM
lplF6sqzUFEgImhw9ZEPSRZO/jbN+ampDjTo9S1ZJodN6Bqzj1sIXiodomkBMQDl
gXkuLPdqHIbefC0C4v59mbKzKtHrErg89rScxnUCgYEA5MCzqrFkqh6QVOm+eykU
IPPYVbGT52W10GBnOZHkY9s+3ySw1nTSSqiVLYknnVCb09vNTqAb4wlzy/q5PeCy
wM391FSH2EkBS2ILIjSUFCmHiy9OSsDEe8RzNNKkv1I8CjIJuBa4qiUKMjNqtWja
PEP8KC2vDOmVNcfytIXkggkCgYAFKaDRuBhq2LpOqNDQjqlctD9NqIDe3qaJXkix
/0X4C8PMSry1phOrOerNMcau32g/4dEeS4f+Uf0Ak6nRP2N9KIAZ4kmRovzXfBmh
enHrz8peh+6uo5WAa8roI7wjjpR5YxTa/UKhwlEJL8d7PKf5OWjzDtLq4nqlJdI2
rG98VQKBgQDKz5ERswQnHFsG5r+SFwxQaWx0tq8cuRor/4+RB/T0Y39PSbPnFL05
3qV+/ohbjJLeHQIHwY2Xtfq3AJhIj59+awY27hICkgI/BQ9BVbOfruGxFcqrsHgV
/ymt46Exh4uxeE2cuZWJTVHpecPPu2X6G9U+tJe0XgnXs+oeH0x6LggICAgICAgI
-----END RSA PRIVATE KEY-----
END_OF_PRIVKEY

chmod 600 /tmp/webos_privkey_tv

sessionToken=$(ssh -i /tmp/webos_privkey_tv \
 -o ConnectTimeout=3 -o StrictHostKeyChecking=no \
 -p 9922 prisoner@YOUR-TV-IP-HERE \
 cat /var/luna/preferences/devmode_enabled)
if [ -z "$sessionToken" ]; then
  sessionToken=$(cat /tmp/webos_devmode_token_tv.txt)
else
  echo $sessionToken > /tmp/webos_devmode_token_tv.txt
fi

if [ -z "$sessionToken" ]; then
  echo "Unable to get token" >&2
  exit 1
fi

checkSession=$(curl --max-time 3 -s "https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=$sessionToken")

echo $checkSession
