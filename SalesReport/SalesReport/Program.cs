using System;
using System.Collections.Generic;
using System.Configuration;
using MySql.Data.MySqlClient;

namespace SalesReport
{
    class MainClass
    {

        public static void Main(string[] args)
        {
            //Console.WriteLine("Hello World!");
            //selectAll("stores");
            Console.WriteLine("Enter start date for sales report");
            Console.Write("Start month: ");
            string startMonth = Console.ReadLine();
            while (!isValidMonth(startMonth))
            {
                Console.WriteLine("Invalid input, try again.");
                Console.Write("Start month: ");
                startMonth = Console.ReadLine();
            }
            Console.Write("Start day: ");
            string startDay = Console.ReadLine();
            while (!isValidDay(startDay))
            {
                Console.WriteLine("Invalid input, try again.");
                Console.Write("Start day: ");
                startDay = Console.ReadLine();
            }
            Console.Write("Start year: ");
            string startYear = Console.ReadLine();
            while (!isValidYear(startYear))
            {
                Console.WriteLine("Invalid input, try again.");
                Console.Write("Start year: ");
                startYear = Console.ReadLine();
            }
            Console.WriteLine("Start date is: " + startMonth + "-" + startDay + "-" + startYear);

            Console.WriteLine("\nEnter end date for sales report");
            Console.Write("End month: ");
            string endMonth = Console.ReadLine();
            while (!isValidMonth(endMonth))
            {
                Console.WriteLine("Invalid input, try again.");
                Console.Write("End month: ");
                endMonth = Console.ReadLine();
            }
            Console.Write("End day: ");
            string endDay = Console.ReadLine();
            while (!isValidDay(endDay))
            {
                Console.WriteLine("Invalid input, try again.");
                Console.Write("End day: ");
                endDay = Console.ReadLine();
            }
            Console.Write("End year: ");
            string endYear = Console.ReadLine();
            while (!isValidYear(endYear))
            {
                Console.WriteLine("Invalid input, try again.");
                Console.Write("End year: ");
                endYear = Console.ReadLine();
            }
            Console.WriteLine("End date is: " + endMonth + "-" + endDay + "-" + endYear);
            string startDate = startYear + "-" + startMonth + "-" + startDay;
            string endDate = endYear + "-" + endMonth + "-" + endDay;
            genReport(startDate, endDate);
            
        }

        static private void genReport(string start, string end)
        {
            //String connectionString = "server=localhost;database=sample;uid=JerLo;pwd=jgameslayer13";
            MySqlConnection connect;
            MySqlDataReader dataReader;
            try
            {
                Console.WriteLine(ConfigurationManager.AppSettings["connectionStr"]);
                connect = new MySqlConnection(ConfigurationManager.AppSettings["connectionStr"]);
                connect.Open();
                Console.WriteLine("Connected!");
                string sqlQuery = "SELECT order_date,store_name,quantity,list_price,first_name,last_name FROM orders " +
                    "INNER JOIN stores ON stores.store_id = orders.store_id " +
                    "INNER JOIN order_items ON order_items.order_id = orders.order_id " +
                    "INNER JOIN customers ON orders.customer_id = customers.customer_id " +
                    "WHERE order_date BETWEEN " + "'" + start + "'" + " AND " + "'" + end + "'";

                //Console.WriteLine(sqlQuery);
                dataReader = new MySqlCommand(sqlQuery, connect).ExecuteReader();
                Console.WriteLine("Query accepted");
                
                var columns = new List<string>();
                for(int i=0; i<dataReader.FieldCount; i++)
                {
                    columns.Add(dataReader.GetName(i));
                }
                string colOutput = string.Format("{0,-10}\t|{1,-10}\t| {2,-10} | {3,-10} | {4,-10} | {5,-10}",
                    columns[0], columns[1], columns[2], columns[3], columns[4], columns[5]); 
                Console.WriteLine(colOutput);
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        string output = string.Format("{0} | {1} | {2} | {3} | {4} | {5}",
                            dataReader.GetString(0), dataReader.GetString(1), dataReader.GetString(2),
                            dataReader.GetString(3), dataReader.GetString(4), dataReader.GetString(5));
                        Console.WriteLine(output);
                    }
                }
                dataReader.Close();
                connect.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine("Conncection Error!");
            }
        }

        static private bool isValidDay(string input)
        {       
            if (!isInteger(input))
            {
                return false;
            }
            if (Convert.ToInt32(input) > 31 || Convert.ToInt32(input) < 1)
            {
                return false;
            }
            return true;
           
        }

        static private bool isValidMonth(string input)
        {
            if (!isInteger(input))
            {
                return false;
            }
            if (Convert.ToInt32(input) > 12 || Convert.ToInt32(input) < 1)
            {
                return false;
            }
            return true;

        }

        static private bool isValidYear(string input)
        {
            if (!isInteger(input))
            {
                return false;
            }
            if (Convert.ToInt32(input) > 2050 || Convert.ToInt32(input) < 1950)
            {
                return false;
            }
            return true;

        }

        static private bool isInteger(string input)
        {
            foreach (char c in input)
            {
                int ch = (int)c;
                if (ch > 57 || ch < 48)
                {
                    return false;
                }
            }
            return true;
        }        
    }
}
