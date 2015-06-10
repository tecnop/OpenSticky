// each.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <string>
#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
#include <fstream>
#include <math.h>

int LARGEUR = 4, LONGUEUR = 4;
std::ofstream myfile;
int cpt = 0;
const char AlphabetLower[2]{'0', '1'};

char up(std::vector<std::string> s, int i, int j)		{ return i - 1 >= 0			? s[i - 1][j] : '0'; };
char down(std::vector<std::string> s, int i, int j)		{ return i + 1 < LONGUEUR	? s[i + 1][j] : '0'; };
char right(std::vector<std::string> s, int i, int j)	{ return j + 1 < LARGEUR	? s[i][j + 1] : '0'; };
char left(std::vector<std::string> s, int i, int j)		{ return j - 1 >= 0			? s[i][j - 1] : '0'; };

char(*pointUP)(std::vector<std::string>, int a, int b)		= up;
char(*pointDOWN)(std::vector<std::string>, int a, int b)	= down;
char(*pointRIGHT)(std::vector<std::string>, int a, int b)	= right;
char(*pointLEFT)(std::vector<std::string>, int a, int b)	= left;

std::map<int, std::vector<std::string>> tabs = std::map<int, std::vector<std::string>>();
std::vector<char(*)(std::vector<std::string>, int, int)> functions{ up, down, right, left };

bool test(std::string s, int nb)
{
	if (nb == 1)
		return true;
	else if (nb == 0)
		return false;
	std::vector<std::string> strings = std::vector<std::string>();
	strings.push_back(s.substr(0, 4));
	strings.push_back(s.substr(4, 4));
	strings.push_back(s.substr(8, 4));
	strings.push_back(s.substr(12, 4));


	for (int i = 0; i < strings.size(); ++i)
	{
		for (int j = 0; j < strings[i].size(); ++j)
		{
			
			if (strings[i][j] == '1')
			{
				bool continuer = false;
				for (int k = 0; k < functions.size(); ++k)
				{
					if (functions[k](strings, i, j) == '1')
					{
						continuer = true;
						break;
					}
				}
				if (!continuer)
					return false;
			}
		}
	}
	return true;
}

void Generate(unsigned int length, std::string s)
{
	if (length == 0) // when length has been reached
	{
		int nb1 = 0;
		for (auto it = s.begin(); it != s.end(); ++it)
		{
			if (*it == '1')
				nb1++;
		}
		if (test(s, nb1))
			tabs[nb1].push_back(s);
		cpt++;
		return;
	}

	for (unsigned int i = 0; i < 2; i++) // iterate through alphabet
	{
		// Create new string with next character
		// Call generate again until string has reached it's length
		std::string appended = s + AlphabetLower[i];
		Generate(length - 1, appended);
	}
}

void generateFileByString()
{
	myfile.open("cubesByString.js");
	myfile << "cubes : [\n";
	for (int i = 0; i < 16; ++i)
	{
		for (int j = 0; j < tabs[i].size(); ++j)
		{
			myfile << "["	<< '"' << tabs[i][j].substr(0, 4) << '"' << ",\n";
			myfile << '"'	<< tabs[i][j].substr(4, 4) << '"' << ",\n";
			myfile << '"'	<< tabs[i][j].substr(8, 4) << '"' << ",\n";
			myfile << '"'	<< tabs[i][j].substr(12, 4) << '"' << ",\n";
			if(i == 15 && j == tabs[i].size()-1)
				myfile << "]\n";
			else
				myfile << "],\n";
		}
	}
	myfile << "]";
	myfile.close();
}

void generateFileByInt()
{
	myfile.open("cubesByInt.js");
	myfile << "cubes : [\n";
	for (int i = 0; i < 16; ++i)
	{

		for (int j = 0; j < tabs[i].size(); ++j)
		{
			int number = 0;
			for (int k = 0; k < tabs[i][j].size(); ++k)
			{
				number += (tabs[i][j][k] - '0') * pow(2, tabs[i][j].size() - k - 1);

			}
			myfile << number;
			if (i == 15 && j == tabs[i].size() - 1)
				myfile << "\n";
			else
				myfile << ",\n";
		}
	}
	myfile << "]";
	myfile.close();
}

void generateFileByIntBySize()
{
	myfile.open("cubesByIntBySize.js");
	myfile << "cubes : [\n";
	for (int i = 1; i < 16; ++i)
	{
		myfile << "[\n";
		for (int j = 0; j < tabs[i].size(); ++j)
		{
			int number = 0;
			for (int k = 0; k < tabs[i][j].size(); ++k)
				number += (tabs[i][j][k] - '0') * pow(2, tabs[i][j].size() - k - 1);
			myfile << number;
			if (j == tabs[i].size() - 1)
				myfile << "\n";
			else
				myfile << ",\n";
		}
		if (i == 15)
			myfile << "]\n";
		else
			myfile << "],\n";
	}
	myfile << "]";
	myfile.close();
}

void Create()
{
	while (1)
	{
		// Keep growing till I get it right
		static unsigned int stringlength = 16;
		Generate(stringlength, "");
		//stringlength++;
		break;
	}
	generateFileByString();
	generateFileByInt();
	generateFileByIntBySize();
	//std::cout << "cpt = " << cpt << std::endl;
}

int main()
{
	int largeur, longueur;
	std::cout << "matrice de largeur : ";
	std::cin >> largeur;
	std::cout << "matrice de longueur : ";
	std::cin >> longueur;
	std::cerr << "wait...";
	Create();
	return 0;
}
