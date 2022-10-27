using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infastructure.Identity
{
    public class UserIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<User> userManager){
            if(!userManager.Users.Any()){
                var user = new User{
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "bob@test.com",
                    Address = new Address{
                        FirstName = "Bob",
                        LastName = "bobbity",
                        Street = "10th Street",
                        City = "Winterpeg",
                        Province = "MB",
                        PostalCode = "a1b2c3"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}