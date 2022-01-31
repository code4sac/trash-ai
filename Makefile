local:
	make -C localdev up

down:
	make -C ./localdev/ down

list:
	make -C infra list

diff:
	make -C infra diff
