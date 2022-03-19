FROM python:3.9

ARG UID=1000

RUN pip3 install --upgrade pip
RUN pip3 install kaggle
RUN useradd -u ${UID} -m -d /home/kaggle -s /bin/bash kaggle
USER kaggle
