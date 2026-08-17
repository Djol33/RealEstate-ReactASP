using FluentValidation;

namespace Application
{
    public class UseCaseExecutor
    {
        private readonly IServiceProvider _provider;

        public UseCaseExecutor(IServiceProvider provider)
        {
            _provider = provider;
        }

        public TResult ExecuteQuery<TSearch, TResult>(IQuery<TSearch, TResult> query, TSearch search)
        {
            return query.Execute(search);
        }
        public void ExecuteCommand<TRequest>(ICommand<TRequest> command, TRequest request)
        {
            command.Execute(request);
        }

    }
}
